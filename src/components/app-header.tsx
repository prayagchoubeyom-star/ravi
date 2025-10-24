export const AppHeader = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-md items-center px-4">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
    </header>
  );
};
