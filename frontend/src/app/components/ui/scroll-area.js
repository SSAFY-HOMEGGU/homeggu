export default function ScrollArea({ children }) {
  return (
    <div className="h-64 w-full overflow-auto rounded-md border bg-white p-4 shadow-md">
      {children}
    </div>
  );
}
