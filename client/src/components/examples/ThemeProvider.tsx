import { ThemeProvider } from "../ThemeProvider";

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background text-foreground">
        <h1 className="text-2xl font-bold">Theme Provider Active</h1>
        <p className="text-muted-foreground mt-2">Theme switching enabled</p>
      </div>
    </ThemeProvider>
  );
}
