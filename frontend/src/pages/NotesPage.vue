<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import type { Note } from "../types/note";
import NoteCard from "../components/NoteCard.vue";
import Navbar from "../components/Navbar.vue";

const router = useRouter();
const notes = ref<Note[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const keyword = ref("");
const course = ref("");
const tag = ref("");

async function fetchNotes() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res = await api.get("/notes", {
      params: {
        keyword: keyword.value || undefined,
        course: course.value || undefined,
        tag: tag.value || undefined,
      },
    });

    notes.value = res.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = "讀取筆記失敗";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  fetchNotes();
}

function handleReset() {
  keyword.value = "";
  course.value = "";
  tag.value = "";
  fetchNotes();
}

function handleDeleted(noteId: number) {
  notes.value = notes.value.filter((note) => note.id !== noteId);
}

onMounted(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  fetchNotes();
});
</script>

<template>
  <div>
    <Navbar />

    <div class="page-container">
      <h1 class="page-title">筆記列表</h1>

      <div class="search-box">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋關鍵字"
          @keyup.enter="handleSearch"
        />

        <input
          v-model="course"
          type="text"
          placeholder="課程名稱"
          @keyup.enter="handleSearch"
        />

        <input
          v-model="tag"
          type="text"
          placeholder="標籤"
          @keyup.enter="handleSearch"
        />

        <button @click="handleSearch">搜尋</button>
        <button @click="handleReset">清除</button>
      </div>

      <p v-if="loading">載入中...</p>
      <p v-else-if="errorMessage">{{ errorMessage }}</p>

      <div v-else-if="notes.length === 0">
        <p>查無符合條件的筆記</p>
      </div>

      <div v-else>
        <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          :showDeleteButton="true"
          @deleted="handleDeleted"
        />
      </div>
    </div>
  </div>
</template>