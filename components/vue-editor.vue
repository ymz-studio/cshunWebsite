<template>
  <div id="vue-editor" class="container">
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
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
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

