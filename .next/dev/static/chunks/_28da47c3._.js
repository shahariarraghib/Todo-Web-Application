(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/content/SeoContent.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SeoContent",
    ()=>SeoContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const SeoContent = {
    baseSeo: {
        title: "AI Headshot Generator | InstaHeadshots",
        description: "",
        image: "/images/home/home.png",
        siteUrl: ("TURBOPACK compile-time value", ""),
        keywords: [
            "lorem ipsum",
            "lorem ipsum "
        ]
    },
    privacySeo: {
        title: "Privacy | InstaHeadshots",
        description: "",
        image: "/images/privacy/privacy.png",
        siteUrl: `${("TURBOPACK compile-time value", "")}/privacy`,
        keywords: [
            "lorem ipsum",
            "lorem ipsum "
        ]
    },
    termsSeo: {
        title: "Terms | InstaHeadshots",
        description: "",
        image: "/images/terms/terms.png",
        siteUrl: `${("TURBOPACK compile-time value", "")}/terms`,
        keywords: [
            "lorem ipsum",
            "lorem ipsum "
        ]
    },
    errorSeo: {
        title: "No Data Found | InstaHeadshots",
        description: "",
        image: "/images/home/home.png",
        siteUrl: ("TURBOPACK compile-time value", ""),
        keywords: [
            "lorem ipsum",
            "lorem ipsum "
        ]
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utility/generateMetadata.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function generateMetadata(seoContent) {
    const { title, description, image, siteUrl, keywords, tags } = seoContent;
    const baseUrl = siteUrl || ("TURBOPACK compile-time value", "") || "";
    const keywordsValue = keywords ? Array.isArray(keywords) ? keywords.join(", ") : keywords : tags;
    const metadata = {
        title: title,
        description: description,
        keywords: keywordsValue,
        openGraph: {
            title: title,
            description: description,
            images: baseUrl ? [
                {
                    url: new URL(image, baseUrl).href
                }
            ] : [
                {
                    url: image
                }
            ],
            url: siteUrl,
            type: "website"
        },
        twitter: {
            title: title,
            description: description,
            images: baseUrl ? [
                {
                    url: new URL(image, baseUrl).href
                }
            ] : [
                {
                    url: image
                }
            ],
            card: "summary_large_image"
        },
        robots: "index, follow",
        creator: "biota",
        publisher: "biota"
    };
    return metadata;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AuthProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$content$2f$SeoContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/content/SeoContent.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utility$2f$generateMetadata$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utility/generateMetadata.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utility$2f$generateMetadata$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateMetadata"])(__TURBOPACK__imported__module__$5b$project$5d2f$content$2f$SeoContent$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SeoContent"].baseSeo);
function Home() {
    _s();
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (auth?.user && auth?.token) {
                // If user is logged in, redirect to dashboard
                router.push("/dashboard");
            } else {
                // If user is not logged in, redirect to login
                router.push("/signup");
            }
        }
    }["Home.useEffect"], [
        auth,
        router
    ]);
    // Show loading state while checking authentication
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-lg",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(Home, "ir2A+6wKaInUyKQ/xMT3phTZHXY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_28da47c3._.js.map