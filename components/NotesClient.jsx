"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const NotesClient = ({initialNotes}) => {
    const [title,setTitle]=useState("");
    const [content,setContent]=useState("");
    const [loading,setLoading]=useState(false);
    const [notes,setNotes]=useState(initialNotes);

    const[editTitle,setEditTitle]=useState("");
     const[editContent,setEditContent]=useState("");
      const[editId,setEditId]=useState(null);


const handleSubmit=async(e)=>{
  e.preventDefault();
  if(!title.trim() || !content.trim()) return; 
setLoading(true);
  try {
    const response=await fetch("/api/notes",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title,content})
    })
   
    const result=await response.json();
    if(result.success){
           setNotes([result.data,...notes]);
           setTitle("");
           setContent("");
    }
    toast.success("Note added successfully");
  } catch (error) {
    console.log(error);
  }
  finally{
     setLoading(false);
  }
}


const deleteNote=async(id)=>{
   try {
    const response=await fetch(`/api/notes/${id}`,{
        method:"DELETE",
    })
    const result=await response.json();
    if(result.success){
        setNotes(notes.filter((note)=>note._id !== id))
        toast.success("Note deleted successfully")
    }
   } catch (error) {
     console.error("Error in delet node",error);
   }
}


const updateNote=async(id)=>{
  if(!editTitle.trim() || !editContent.trim()){
    return ;
  }

  setLoading(true);
  try {
    const response=await fetch(`/api/notes/${id}`,{
      method:"PUT",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({title:editTitle,content:editContent})
    });

    const result=await response.json();

    if(result.success){
      setNotes(notes.map((note)=>note._id === id ? result.data:note));
      setEditContent("");
      setEditId(null);
      setEditTitle("");
    }
    toast.success("Note updated successfully");
    
  } catch (error) {
    console.error("Error in update",error);
  }
   finally {
  setLoading(false);
}
}

const startEdit=(note)=>{
  setEditId(note._id);
  setEditContent(note.content);
  setEditTitle(note.title);
}

  const canceledit=(note)=>{
  setEditId(null);
  setEditContent("");
  setEditTitle("");
  }


  return (
    <div className='space-y-6'>
    <form className='bg-white p-4 shadow-md rounded-lg' onSubmit={handleSubmit}>
        <h2 className='text-xl font-bold mb-4'>Create New Note</h2>
        <div className='space-y-4'>
<label className='text-gray-800 font-medium py-3'  htmlFor="title">Title</label>
       <input className='w-full mb-5 p-3 border textgray-900 font-semibold border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder='Note title....' value={title} onChange={(e)=>setTitle(e.target.value)} required/>

        <label className='text-gray-800 font-medium py-3' htmlFor="content">Content</label>
            <textarea className='w-full p-3 border textgray-900 font-semibold border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' name="content" id="content" rows={4} placeholder='Note Content'value={content} 
            onChange={(e)=>setContent(e.target.value)}></textarea>
        </div>
        <button disabled={loading} className='bg-blue-500 px-6 mt-3 py-2 text-white hover:bg-blue-800 border border-gray-500 rounded-md p-1 text-2xl disabled:opacity-50 ' type='submit'>{loading ? "Loading...":"Create Note"}</button>
    </form>
    <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Your Notes ({notes.length})</h2>
        {
            notes.length === 0 ? (<p className='text-gray-500 font-semibold'>No Notes Yet.Create your first note above</p>):(
                notes.map((note)=>(
                 <div key={note._id} className='bg-white p-6 shadow-md rounded-lg'>
                  {
                    editId === note._id ? (
                    <>
                    <div className='space-y-4'>
                     <input className='w-full mb-5 p-3 border textgray-900 font-semibold border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder={note.title} value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} required/>

                       <textarea className='w-full p-3 border textgray-900 font-semibold border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' name="content" id="content" rows={4} placeholder={note.content}value={editContent} 
            onChange={(e)=>setEditContent(e.target.value)}></textarea>

            <div className='flex gap-2'>

              <button onClick={()=>updateNote(note._id)} type="button" className='bg-green-500 transition-colors rounded-md py-2 px-2 hover:bg-green-800 text-white'>{loading ? "Saving...":"Save"}</button>

              <button onClick={()=>canceledit(note)} className='bg-gray-500 py-2 px-2 transition-colors hover:bg-gray-700 rounded-lg text-white'>Cancel</button>
            </div>
                    </div>
                    </>):
                    (<>
                    <div className='flex justify-between items-start mb-2'>
                              <h3 className='text-gray-600 text-lg font-semibold'>{note.title}</h3>
                              <div className='flex gap-2'>
                  <button onClick={()=>startEdit(note)} className='text-blue-500 shadow-lg hover:text-blue-700 border rounded-sm bg-gray-200 p-0.5 border-gray-500 text-sm'>Edit</button>
                   <button onClick={()=>deleteNote(note._id)} className='text-red-500 shadow-lg border rounded-sm bg-gray-200 p-0.5 border-gray-500 hover:text-red-700 text-sm'>Delete</button>
                     </div>
                   </div>
                   <p className='text-gray-700 mb-2'>{note.content}</p>
                    </>)
                  }

                   
                 </div>
                ))
            )
        }
    </div>
    </div>
  )
}


export default NotesClient