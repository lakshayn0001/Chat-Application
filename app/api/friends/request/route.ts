import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { receiverId } = body;

        if (!receiverId) {
            return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
        }
        const senderID = parseInt(session.user.id, 10);
        const receiverID = parseInt(receiverId, 10);

        if (isNaN(senderID) || isNaN(receiverID)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        if (senderID === receiverID) {
            return NextResponse.json({ error: "You can't send a request to yourself" }, { status: 400 });
        }

        const receiverUser = await prisma.user.findUnique({
            where: { id: receiverID }
        });
        if (!receiverUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderID, receiverID },
                    { senderID: receiverID, receiverID: senderID }
                ]
            }
        });

        if (existingRequest) {
            if (existingRequest.status === "PENDING") {
                return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
            }
            if (existingRequest.status === "ACCEPTED") {
                return NextResponse.json({ error: "You are already friends" }, { status: 400 });
            }
        }

        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderID,
                receiverID,
                status: "PENDING"
            }
        });

        return NextResponse.json({ message: "Friend Request Sent", friendRequest }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
    }
}


export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { requestId, action } = body;

        if (!requestId || !action || !["ACCEPTED", "REJECTED"].includes(action)) {
            return NextResponse.json({ error: "Request ID and valid action are required" }, { status: 400 });
        }

        const currentUserId = parseInt(session.user.id, 10);
        const existingRequest = await prisma.friendRequest.findUnique({
            where: { id: requestId }
        });

        if (!existingRequest) {
            return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
        }

        if (existingRequest.receiverID !== currentUserId) {
            return NextResponse.json({ error: "You are not authorized to respond to this request" }, { status: 403 });
        }

        const updateRequest = await prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: action as "ACCEPTED" | "REJECTED" }
        });

        return NextResponse.json({ message: `Friend request ${action.toLowerCase()} successfully`, updateRequest }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ error: "Failed to respond to friend request" }, { status: 500 });
    }
}