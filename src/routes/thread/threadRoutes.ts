import express from "express";
import { getThreads } from "../../controllers/thread/getThreads";
import { createThread } from "../../controllers/thread/createThreads";
import { authenticate } from "../../middleware/authenticate";
import { getThreadById } from "../../controllers/thread/getThreadbyID";
import { getThreadsUser } from "../../controllers/thread/getThreadUser";
import { getThreadsByUsername } from "../../controllers/thread/threadsUser";
import { upload } from "../../utils/multer";
import { getThreadsByUserId } from "../../controllers/thread/getThreadsbyUserId";

const router = express.Router();

/**
 * @swagger
 * /api/v1/thread/threads:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Get all threads
 *     description: Get all thread from all user post and order by the newest thread
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Daftar thread berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Data Thread Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     threads:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "01be3d4e-760b-4ba4-91ad-1837942867f5"
 *                           content:
 *                             type: string
 *                             example: "Ini adalah postingan thread pertama saya!"
 *                           image:
 *                             type: string
 *                             nullable: true
 *                             example: "/uploads/threads/image1.png"
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "3947bf9e-bf71-4462-a0e9-edb1973cc95b"
 *                               username:
 *                                 type: string
 *                                 example: "monster"
 *                               name:
 *                                 type: string
 *                                 example: "Johan Liebert"
 *                               profile_picture:
 *                                 type: string
 *                                 nullable: true
 *                                 example: "/uploads/profile/liebert.png"
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-09-25T10:20:30.000Z"
 *                           likes:
 *                             type: integer
 *                             example: 5
 *                           reply:
 *                             type: integer
 *                             example: 2
 *                           isLiked:
 *                             type: boolean
 *                             example: true
 *       401:
 *         description: Unauthorized, user belum login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized, token tidak ditemukan
 *       500:
 *         description: Kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/threads", authenticate, getThreads);

/**
 * @swagger
 * /api/v1/thread/threads:
 *   post:
 *     tags:
 *       - Threads
 *     summary: Create a new thread
 *     description: Create new thread with text content or image
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Isi thread (boleh kosong jika ada gambar).
 *                 example: "Halo ini thread pertama saya!"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar yang diupload (opsional).
 *     responses:
 *       201:
 *         description: Thread berhasil diposting
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Thread berhasil diposting.
 *                 data:
 *                   type: object
 *                   properties:
 *                     thread:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "thread-123"
 *                         content:
 *                           type: string
 *                           example: "Halo ini thread pertama saya!"
 *                         image:
 *                           type: string
 *                           nullable: true
 *                           example: "/uploads/thread/thread1.png"
 *                         user:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "user-123"
 *                             username:
 *                               type: string
 *                               example: "johndoe"
 *                             name:
 *                               type: string
 *                               example: "John Doe"
 *                             profile_picture:
 *                               type: string
 *                               nullable: true
 *                               example: "/uploads/profile/johndoe.png"
 *                             backgroundPhoto:
 *                               type: string
 *                               nullable: true
 *                               example: "/uploads/background/bg1.png"
 *                             bio:
 *                               type: string
 *                               nullable: true
 *                               example: "Software Engineer & Coffee Lover"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-09-25T10:30:00.000Z"
 *                         likes:
 *                           type: integer
 *                           example: 0
 *                         reply:
 *                           type: integer
 *                           example: 0
 *                         isLiked:
 *                           type: boolean
 *                           example: false
 *       400:
 *         description: Content atau image tidak diberikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content atau image wajib diisi
 *       401:
 *         description: Unauthorized, user belum login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/threads", authenticate, upload.single("image"), createThread);

/**
 * @swagger
 * /api/v1/thread/{id}:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Get thread by ID
 *     description: Get Detail for one thread by Id, include user, likes, and replies
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID thread yang ingin diambil
 *     responses:
 *       200:
 *         description: Thread berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     thread:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "thread-123"
 *                         content:
 *                           type: string
 *                           example: "Isi thread di sini"
 *                         image:
 *                           type: string
 *                           nullable: true
 *                           example: "/uploads/thread/thread1.png"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-09-25T12:00:00.000Z"
 *                         likes:
 *                           type: integer
 *                           example: 10
 *                         reply:
 *                           type: integer
 *                           example: 3
 *                         isLiked:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Thread not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", authenticate, getThreadById);

/**
 * @swagger
 * /api/v1/thread/threads/me:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Get current user's threads
 *     description: Ambil semua thread yang diposting oleh user yang sedang login.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Daftar thread milik user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 postCount:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "thread-123"
 *                       content:
 *                         type: string
 *                         example: "Thread saya sendiri"
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: "/uploads/thread/mythread.png"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-25T12:00:00.000Z"
 *                       likes:
 *                         type: integer
 *                         example: 8
 *                       reply:
 *                         type: integer
 *                         example: 2
 *                       isLiked:
 *                         type: boolean
 *                         example: true
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "user-789"
 *                           username:
 *                             type: string
 *                             example: "johndoe"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           profile_picture:
 *                             type: string
 *                             nullable: true
 *                             example: "/uploads/profile/johndoe.png"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get("/threads/me", authenticate, getThreadsUser);

/**
 * @swagger
 * /api/v1/thread/threads/{username}:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Get user's threads by username
 *     description: Ambil semua thread berdasarkan username tertentu.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username dari user
 *     responses:
 *       200:
 *         description: Daftar thread dari user dengan username tertentu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 postCount:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "thread-456"
 *                       content:
 *                         type: string
 *                         example: "Postingan user tertentu"
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: "/uploads/thread/post.png"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-25T10:00:00.000Z"
 *                       likes:
 *                         type: integer
 *                         example: 12
 *                       reply:
 *                         type: integer
 *                         example: 4
 *                       isLiked:
 *                         type: boolean
 *                         example: false
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "user-123"
 *                           username:
 *                             type: string
 *                             example: "monster"
 *                           name:
 *                             type: string
 *                             example: "Monster User"
 *                           profile_picture:
 *                             type: string
 *                             nullable: true
 *                             example: "/uploads/profile/monster.png"
 *       400:
 *         description: Username tidak diberikan
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Internal Server Error
 */
router.get("/threads/:username", authenticate, getThreadsByUsername);

/**
 * @swagger
 * /api/v1/thread/threads/stats/{userId}:
 *   get:
 *     tags:
 *       - Threads
 *     summary: Get threads by user ID
 *     description: Ambil semua thread berdasarkan userId (beserta replies dan likes).
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user
 *     responses:
 *       200:
 *         description: Daftar thread berdasarkan userId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "thread-789"
 *                       content:
 *                         type: string
 *                         example: "Thread milik userId tertentu"
 *                       image:
 *                         type: string
 *                         nullable: true
 *                         example: "/uploads/thread/thread.png"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-25T10:00:00.000Z"
 *                       created_by:
 *                         type: string
 *                         example: "user-123"
 *                       replies:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "reply-1"
 *                             content:
 *                               type: string
 *                               example: "Reply ke thread ini"
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "like-1"
 *                             user_id:
 *                               type: string
 *                               example: "user-999"
 *       500:
 *         description: Internal Server Error
 */
router.get("/threads/stats/:userId", authenticate, getThreadsByUserId);

export default router;
