import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BlogAdmin() {
  const qc = useQueryClient();
  const { data: posts = [] } = useQuery<any[]>({
    queryKey:['blog','admin'],
    queryFn: async ()=> (await fetch('/api/blog-admin')).json(),
  });

  const delMutation = useMutation({
    mutationFn: async (id:number)=>{await fetch(`/api/blog/${id}`,{method:'DELETE'});},
    onSuccess:()=>qc.invalidateQueries({queryKey:['blog','admin']}),
  });

  const [form, setForm] = useState({title:'',content:'',image:'',slug:''});
  const addMutation = useMutation({
    mutationFn: async ()=>{await fetch('/api/blog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});},
    onSuccess:()=>{setForm({title:'',content:'',image:'',slug:''});qc.invalidateQueries({queryKey:['blog','admin']});}
  });

  return (
    <main className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog Admin</h1>
      {/* Add form */}
      <div className="mb-12 bg-gray-100 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-bold">Add New Post</h2>
        <input className="border p-2 w-full" placeholder="slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} />
        <input className="border p-2 w-full" placeholder="title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input className="border p-2 w-full" placeholder="image url" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} />
        <textarea className="border p-2 w-full h-40" placeholder="HTML content" value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/>
        <Button onClick={()=>addMutation.mutate()} className="bg-[var(--premium-accent)] text-black">Publish</Button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr><th>ID</th><th>Slug</th><th>Title</th><th>Active</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {posts.map(p=>(
            <tr key={p.id} className="border-b">
              <td>{p.id}</td><td>{p.slug}</td><td>{p.title}</td><td>{p.active? 'Yes':'No'}</td>
              <td>
                {/* Inactivate/activate */}
                <Button size="sm" onClick={async()=>{await fetch(`/api/blog/${p.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({active: p.active?0:1})});qc.invalidateQueries({queryKey:['blog','admin']});}}>
                  {p.active? 'Deactivate':'Activate'}
                </Button>
                <Button size="sm" variant="destructive" onClick={()=>delMutation.mutate(p.id)} className="ml-2">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
} 