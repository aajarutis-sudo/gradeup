// app/api/admin/upload-paper/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const examBoardName = formData.get('examBoard') as string
        const subjectName = formData.get('subject') as string
        const year = parseInt(formData.get('year') as string)
        const paperNumber = formData.get('paperNumber') as string
        const tier = (formData.get('tier') as string) || 'NONE'
        const paperFile = formData.get('paperFile') as File
        const markSchemeFile = formData.get('markSchemeFile') as File

        if (!examBoardName || !subjectName || !year || !paperNumber) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        // Get subject
        const subject = await prisma.subject.findFirst({
            where: { title: subjectName }
        })

        if (!subject) {
            return NextResponse.json(
                { success: false, error: 'Subject not found' },
                { status: 404 }
            )
        }

        // Get or create exam board
        let examBoard = await prisma.examBoard.findFirst({
            where: { name: examBoardName }
        })

        if (!examBoard) {
            examBoard = await prisma.examBoard.create({
                data: {
                    name: examBoardName,
                    slug: examBoardName.toLowerCase().replace(/\s+/g, '-'),
                }
            })
        }

        const examBoardId = examBoard.id

        let paperUrl: string | null = null
        let markSchemeUrl: string | null = null

        if (paperFile && paperFile.size > 0) {
            paperUrl = `https://gradeup-pdfs.blob.vercel-storage.com/${year}-${paperNumber}-${examBoardName}.pdf`
        }

        if (markSchemeFile && markSchemeFile.size > 0) {
            markSchemeUrl = `https://gradeup-pdfs.blob.vercel-storage.com/${year}-${paperNumber}-${examBoardName}-mark-scheme.pdf`
        }

        const pastPaper = await prisma.pastPaper.create({
            data: {
                subjectId: subject.id,
                examBoardId: examBoardId,
                year,
                series: 'Unknown',
                paperNumber,
                fileUrl: paperUrl || '',
                markSchemeUrl,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Paper uploaded successfully',
                data: {
                    paperId: pastPaper.id,
                    year: pastPaper.year,
                    paperNumber: pastPaper.paperNumber,
                    examBoard: examBoardName,
                    subject: subject.title,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ success: false, error: 'Failed to upload paper' }, { status: 500 })
    }
}
