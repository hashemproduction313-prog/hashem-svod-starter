export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  // Ne touche pas le HTML global : juste laisser passer le contenu.
  return <>{children}</>;
}
