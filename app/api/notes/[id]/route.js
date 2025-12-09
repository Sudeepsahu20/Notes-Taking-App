import dbConnect from "@/lib/db";
import Note from "@/modals/Note";
import { NextResponse } from "next/server";


export async function DELETE(request,{params}){
    
   try {
    await dbConnect();
    const {id}=await params;
    const note= await Note.findByIdAndDelete(id);

    if(!note){
        return NextResponse.json({
            success:false,
            error:"No note to delete"
        },{status:400});
    }

    return NextResponse.json({
        success:true,
        message:"Note deleted successfully",
       data:{}

    },{status:200});
   } catch (error) {
    return NextResponse.json({
        success:false,
        error:error.message
    },{status:500});
   }
}

export async function PUT(request,{params}){
    try {
        await dbConnect();
        let {id}=await params;
        const body=await request.json();

        const note=await Note.findByIdAndUpdate(
            id,
            {...body},{new:true,runValidators:true}
    );

    if(!note){
        return NextResponse.json({
            success:false,
            error:"No Note"
        },{status:400});
    }

    return NextResponse.json({
        success:true,
        data:note,

    },{status:200});
    } catch (error) {
        return NextResponse.json({
            success:false,
            error:error.message
        },{status:500});
    }

}