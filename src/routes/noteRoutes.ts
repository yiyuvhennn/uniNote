import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const notes = await prisma.note.findMany({
      include: {
        author: true,
        tags: {
          include: {
            tag: true
          }
        },
        favorites: true
      }
    });

    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

export default router;
