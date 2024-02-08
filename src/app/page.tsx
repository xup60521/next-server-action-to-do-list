import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  
  const posts = await api.post.getPost.query()
  const add = async (formData: FormData) => {
    'use server'
    const data = formData.get("input")?.toString()
    if (data) {
      await api.post.create.mutate(data)
      revalidatePath("/")
    }
  }

  const deleteToDo = async (id: number) => {
    'use server'
    
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#5d4776] to-[#191d60] text-white gap-2">
      <h1 className="text-3xl font-bold font-mono"><span className="text-red-200">To-Do List</span> w/Next.js Server Action & tRPC</h1>
      <form action={add} className="flex gap-2 w-[42rem] items-center">
        <input type="text" name="input" className="w-full rounded-md text-black bg-purple-50 p-2 flex-grow" />
        <button type="submit" className="rounded-md hover:bg-purple-300 transition-all bg-purple-200 p-2 px-4 text-black font-bold w-20">Add</button>
      </form>
      {posts.map((post) => (
        <div key={post.id} className="w-[42rem] flex items-center justify-between bg-white rounded-md p-4">
          <p className="text-black font-bold">{post.name}</p>
          <form>
            <button formAction={async ()=>{
              'use server'
              await api.post.deletePost.mutate(post.id)
              revalidatePath("/")
            }} className="w-20 rounded-md p-2 px-4 text-white bg-green-800 font-bold">Delete</button>
          </form>
        </div>
        ))}
    </main>
  );
}
