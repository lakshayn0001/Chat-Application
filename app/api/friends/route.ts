import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        const currentUserId = parseInt(session.user.id, 10);
        if (isNaN(currentUserId)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        const friendShips = await prisma.friendRequest.findMany({
            where: {
                OR: [
                    { senderID: currentUserId, status: "ACCEPTED" },
                    { receiverID: currentUserId, status: "ACCEPTED" }
                ]
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                }
            }
        });

        const friends = friendShips.map((f) => {
            return f.senderID === currentUserId ? f.receiver : f.sender;
        });

        return NextResponse.json({ friends }, { status: 200 });
    } catch (err: any) {
        console.error("PRISMA ERROR:", err);
        return NextResponse.json({
            error: "Failed to fetch friend",
            code: err?.code,
            meta: err?.meta,
            message: err?.message || String(err)
        }, { status: 500 });
    }
}
