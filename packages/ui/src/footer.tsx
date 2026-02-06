export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-4xl px-6 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
