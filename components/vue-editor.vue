<template>
  <div id="vue-editor">
    <div class="quill-editor" :content="value" @change="onContentChange($event)" v-quill:myQuillEditor="editorOption">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editorOption: {
        // some quill options
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["link", "image", "video"]
          ]
        },
        theme: "snow"
      }
    };
  },
  props: {
    value: {
      //传入内容
      type: String,
      required: true
    }
  },
  methods: {
    onContentChange({ quill, html, text }) {
      this.$emit("input", html);
    }
  }
};
</script>

