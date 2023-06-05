<script setup>
import { ref, onMounted } from "vue";
import * as pdfjsLib from "pdfjs-dist";

const props = defineProps({
    link: String,
});

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js";

const pdfUrl = ref(props.link);
let pdfDoc = null;
const currentPage = ref(1);
const zoomLevel = ref(
    window.matchMedia("(max-width: 768px)").matches ? 0.65 : 0.95
);
const pdfcontainer = ref(null);

const renderPDF = () => {
    pdfjsLib
        .getDocument(pdfUrl.value)
        .promise.then((doc) => {
            pdfDoc = doc;
            renderPage(currentPage.value);
        })
        .catch((error) => {
            console.error("Error loading PDF:", error);
        });
};

const renderPage = (pageNumber) => {
    pdfDoc.getPage(pageNumber).then((page) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: zoomLevel.value });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        page.render(renderContext)
            .promise.then(() => {
                pdfcontainer.value.innerHTML = "";
                pdfcontainer.value.appendChild(canvas);
            })
            .catch((error) => {
                console.error("Error rendering page:", error);
            });
    });
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        renderPage(currentPage.value);
    }
};

const nextPage = () => {
    if (currentPage.value < pdfDoc.numPages) {
        currentPage.value++;
        renderPage(currentPage.value);
    }
};

const zoomIn = () => {
    zoomLevel.value += 0.1;
    renderPage(currentPage.value);
};

const zoomOut = () => {
    if (zoomLevel.value > 0.1) {
        zoomLevel.value -= 0.1;
        renderPage(currentPage.value);
    }
};

onMounted(() => {
    renderPDF();
});
</script>

<template>
    <div>
        <div
            ref="pdfcontainer"
            class="w-full h-auto border-2 border-indigo-200 rounded-md overflow-x-auto"
        ></div>
        <div class="flex gap-2 justify-center mt-2">
            <button
                v-on:click="previousPage"
                class="rounded-md bg-indigo-800 text-gray-50 px-3 py-1 transition ease-in-out focus:scale-95 hover:-translate-y-1"
            >
                &lt;
            </button>
            <input
                type="number"
                v-model="currentPage"
                class="rounded-md border-2 border-gray-300 px-3 py-1 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 text-center w-20"
            />
            <button
                v-on:click="nextPage"
                class="rounded-md bg-indigo-800 text-gray-50 px-3 py-1 transition ease-in-out focus:scale-95 hover:-translate-y-1"
            >
                &gt;
            </button>
            <button
                v-on:click="zoomIn"
                class="rounded-md bg-indigo-800 text-gray-50 px-3 py-1 transition ease-in-out focus:scale-95 hover:-translate-y-1"
            >
                &plus;
            </button>
            <input
                type="number"
                v-model="zoomLevel"
                class="rounded-md border-2 border-gray-300 px-3 py-1 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 text-center w-20"
            />
            <button
                v-on:click="zoomOut"
                class="rounded-md bg-indigo-800 text-gray-50 px-3 py-1 transition ease-in-out focus:scale-95 hover:-translate-y-1"
            >
                &minus;
            </button>
        </div>
        <a
            v-bind:href="pdfUrl"
            class="text-indigo-500 hover:underline text-center block my-4"
            download
            >Download resume <i class="bi bi-download"></i
        ></a>
    </div>
</template>
