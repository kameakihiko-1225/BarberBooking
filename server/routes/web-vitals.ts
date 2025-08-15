import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Web Vitals log schema
const WebVitalSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  route: z.string().optional(),
  timestamp: z.number(),
  userAgent: z.string(),
  connectionType: z.string().optional(),
  sessionId: z.string(),
  build: z.string()
});

type WebVitalLog = z.infer<typeof WebVitalSchema>;

// In-memory storage for web vitals (in production, use a database)
const webVitalsLogs: WebVitalLog[] = [];

// Store web vitals data
router.post('/', async (req, res) => {
  try {
    const vital = WebVitalSchema.parse(req.body);
    
    // Add server timestamp
    const logEntry: WebVitalLog & { serverTimestamp: number } = {
      ...vital,
      serverTimestamp: Date.now()
    };

    // Store in memory (in production, save to database)
    webVitalsLogs.push(vital);

    // Log to console for monitoring
    console.log('📊 Web Vital Received:', {
      metric: vital.name,
      value: vital.value,
      rating: vital.rating,
      route: vital.route,
      sessionId: vital.sessionId,
      timestamp: new Date(vital.timestamp).toISOString()
    });

    // Enhanced logging for gallery routes
    if (vital.route && (vital.route.includes('/gallery') || vital.route.includes('/students') || vital.route.includes('/success'))) {
      console.log('🖼️ Gallery Performance:', {
        metric: vital.name,
        value: vital.value,
        rating: vital.rating,
        route: vital.route,
        connection: vital.connectionType
      });

      // Alert on poor gallery performance
      if (vital.rating === 'poor') {
        console.warn(`⚠️  Poor ${vital.name} on gallery route ${vital.route}: ${vital.value}`);
      }
    }

    // Keep only last 1000 entries to prevent memory issues
    if (webVitalsLogs.length > 1000) {
      webVitalsLogs.splice(0, webVitalsLogs.length - 1000);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing web vital:', error);
    res.status(400).json({ error: 'Invalid web vital data' });
  }
});

// Get web vitals analytics
router.get('/', async (req, res) => {
  try {
    const { route, metric, timeframe = '24h' } = req.query;

    let filtered = [...webVitalsLogs];

    // Filter by route
    if (route && typeof route === 'string') {
      filtered = filtered.filter(log => log.route?.includes(route));
    }

    // Filter by metric
    if (metric && typeof metric === 'string') {
      filtered = filtered.filter(log => log.name === metric);
    }

    // Filter by timeframe
    const now = Date.now();
    const timeframeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - (timeframeMs[timeframe as keyof typeof timeframeMs] || timeframeMs['24h']);
    filtered = filtered.filter(log => log.timestamp > cutoff);

    // Calculate statistics
    const stats = calculateWebVitalStats(filtered);

    res.json({
      totalLogs: filtered.length,
      timeframe,
      filters: { route, metric },
      stats,
      recentLogs: filtered.slice(-10) // Last 10 logs
    });
  } catch (error) {
    console.error('Error retrieving web vitals:', error);
    res.status(500).json({ error: 'Failed to retrieve web vitals' });
  }
});

// Get gallery-specific analytics
router.get('/gallery', async (req, res) => {
  try {
    const galleryLogs = webVitalsLogs.filter(log => 
      log.route && (log.route.includes('/gallery') || log.route.includes('/students') || log.route.includes('/success'))
    );

    const galleryStats = calculateWebVitalStats(galleryLogs);

    // Gallery-specific insights
    const insights = {
      totalGalleryViews: new Set(galleryLogs.map(log => log.sessionId)).size,
      averageLoadTime: galleryStats.LCP?.average || 0,
      layoutStability: galleryStats.CLS?.average || 0,
      interactivity: galleryStats.FID?.average || 0,
      topRoutes: getTopRoutes(galleryLogs),
      performanceByRoute: getPerformanceByRoute(galleryLogs),
      connectionTypeBreakdown: getConnectionTypeBreakdown(galleryLogs)
    };

    res.json({
      totalLogs: galleryLogs.length,
      stats: galleryStats,
      insights,
      recentGalleryLogs: galleryLogs.slice(-20)
    });
  } catch (error) {
    console.error('Error retrieving gallery vitals:', error);
    res.status(500).json({ error: 'Failed to retrieve gallery vitals' });
  }
});

// Helper functions
function calculateWebVitalStats(logs: WebVitalLog[]) {
  const stats: Record<string, { average: number; median: number; p95: number; good: number; poor: number }> = {};

  const metrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB'];
  
  for (const metric of metrics) {
    const metricLogs = logs.filter(log => log.name === metric);
    if (metricLogs.length === 0) continue;

    const values = metricLogs.map(log => log.value).sort((a, b) => a - b);
    const ratings = metricLogs.map(log => log.rating);

    stats[metric] = {
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      median: values[Math.floor(values.length / 2)],
      p95: values[Math.floor(values.length * 0.95)],
      good: ratings.filter(r => r === 'good').length,
      poor: ratings.filter(r => r === 'poor').length
    };
  }

  return stats;
}

function getTopRoutes(logs: WebVitalLog[]) {
  const routeCounts: Record<string, number> = {};
  logs.forEach(log => {
    if (log.route) {
      routeCounts[log.route] = (routeCounts[log.route] || 0) + 1;
    }
  });

  return Object.entries(routeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([route, count]) => ({ route, count }));
}

function getPerformanceByRoute(logs: WebVitalLog[]) {
  const routePerformance: Record<string, { lcp: number[]; cls: number[]; fid: number[] }> = {};

  logs.forEach(log => {
    if (!log.route) return;
    
    if (!routePerformance[log.route]) {
      routePerformance[log.route] = { lcp: [], cls: [], fid: [] };
    }

    if (log.name === 'LCP') routePerformance[log.route].lcp.push(log.value);
    if (log.name === 'CLS') routePerformance[log.route].cls.push(log.value);
    if (log.name === 'FID') routePerformance[log.route].fid.push(log.value);
  });

  return Object.entries(routePerformance).map(([route, metrics]) => ({
    route,
    avgLCP: metrics.lcp.length ? metrics.lcp.reduce((a, b) => a + b, 0) / metrics.lcp.length : 0,
    avgCLS: metrics.cls.length ? metrics.cls.reduce((a, b) => a + b, 0) / metrics.cls.length : 0,
    avgFID: metrics.fid.length ? metrics.fid.reduce((a, b) => a + b, 0) / metrics.fid.length : 0
  }));
}

function getConnectionTypeBreakdown(logs: WebVitalLog[]) {
  const connections: Record<string, number> = {};
  logs.forEach(log => {
    const conn = log.connectionType || 'unknown';
    connections[conn] = (connections[conn] || 0) + 1;
  });
  return connections;
}

export default router;