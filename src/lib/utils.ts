export function showToast(msg: string) {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(".toast-notif");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.className =
    "toast-notif fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest z-[250] animate-fade-in border border-white/10 shadow-2xl text-center min-w-[240px]";
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translate(-50%, 10px)";
    setTimeout(() => t.remove(), 400);
  }, 3000);
}
