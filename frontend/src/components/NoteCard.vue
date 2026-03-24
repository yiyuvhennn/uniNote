<script setup lang="ts">
import { ref } from "vue";
import type { Note } from "../types/note";
import api from "../services/api";

const props = defineProps<{
  note: Note;
  initialFavorited?: boolean;
}>();

const emit = defineEmits<{
  (e: "unfavorited", noteId: number): void;
}>();

const isFavorited = ref(props.initialFavorited ?? false);

async function toggleFavorite() {
  try {
    if (!isFavorited.value) {
      await api.post("/favorites", {
        noteId: props.note.id,
      });
      isFavorited.value = true;
    } else {
      await api.delete(`/favorites/${props.note.id}`);
      isFavorited.value = false;
      emit("unfavorited", props.note.id);
    }
  } catch (error) {
    console.error("收藏操作失敗", error);
  }
}
</script>

<template>
  <div class="card">
    <router-link
      :to="`/notes/${props.note.id}`"
      style="text-decoration: none;"
    >
      <h3 class="card-title">{{ props.note.title }}</h3>
    </router-link>

    <p class="card-text">{{ props.note.description }}</p>
    <p class="card-text">課程：{{ props.note.course }}</p>
    <p class="card-text">作者：{{ props.note.author?.name }}</p>

    <a :href="props.note.fileUrl" target="_blank">查看檔案</a>

    <div style="margin-top: 12px;">
      <button @click="toggleFavorite">
        {{ isFavorited ? "取消收藏" : "收藏" }}
      </button>
    </div>
  </div>
</template>