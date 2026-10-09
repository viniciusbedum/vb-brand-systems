export default function AssetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main data-backdrop="assets" className="flex-1 overflow-y-auto" id="content" role="main">
      {children}
    </main>
  );
}
