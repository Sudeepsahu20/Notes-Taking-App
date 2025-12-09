import dbConnect from "@/lib/db";
import Note from "@/modals/Note";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect();

       const note=await Note.find({}).sort({createdAt:-1});
       
        return NextResponse.json({
            success:true,
            data:note
        },{status:200});
    } catch (error) {
        return NextResponse.json({
            success:false,
            error:error.message
        },{status:500});
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body= await request.json();

        if (!body || !body.title || !body.content) {
            return NextResponse.json({
                success: false,
                error: "Title and content are required"
            }, { status: 400 });
        }
        const note=await Note.create(body);

        return NextResponse.json({
            success:true,
            data:note,
            message:"Note created/added"
        },{status:201});

    } catch (error) {
        return NextResponse.json({
            success:false,
            error:error.message
        },{status:400})
    }
}