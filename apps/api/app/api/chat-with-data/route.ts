import { NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/prisma'; 

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        }
    );
}

export async function POST(req: Request) {
    const { question } = await req.json();

    if (!question) {
        return new NextResponse(JSON.stringify({ error: 'Question is required' }), { status: 400 });
    }

    const vannaApiUrl = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';

    try {
        const vannaResponse = await axios.post(`${vannaApiUrl}/generate_sql`, {
            question: question,
        });
        
        const { sql, data, explanation } = vannaResponse.data;

        return NextResponse.json({
            sql,
            data,
            explanation
        });

    } catch (error: any) {
        console.error('Error in chat-with-data flow:', error.message);
        return new NextResponse(JSON.stringify({ error: 'Failed to process chat query' }), { status: 500 });
    }
}