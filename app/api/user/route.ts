import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        const email = user?.primaryEmailAddress?.emailAddress;

        // 1. Authentication Guard
        if (!email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const name = user?.fullName ?? user?.firstName ?? "User";

        // 2. Check for existing user
        const existingUsers = await db.select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (existingUsers.length === 0) {
            // 3. Safe Insert with Conflict Handling
            const [newUser] = await db.insert(usersTable)
                .values({
                    email: email,
                    name: name,
                })
                .onConflictDoNothing({ target: usersTable.email })
                .returning();

            // 4. Handle edge case where conflict occurred between select and insert
            if (!newUser) {
                const [conflictUser] = await db.select()
                    .from(usersTable)
                    .where(eq(usersTable.email, email));
                return NextResponse.json(conflictUser);
            }

            return NextResponse.json(newUser);
        }

        return NextResponse.json(existingUsers[0]);
        
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}