import { NextResponse } from 'next/server';

import UploadFile from '@/utills/UploadFile';

export async function POST(req: Request) {
    try {    
        const formData = await req.formData();      
        const file = formData.get('file') as File;     
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }        

        let res = await UploadFile(file);
        
        return NextResponse.json({ url: res }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
