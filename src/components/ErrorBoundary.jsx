import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// Global xato ushlagich (Error Boundary).
// Backend ulangach tarmoq/server xatolari chiqishi tabiiy holat —
// bu komponent bo'lmasa, kutilmagan xato butun ilovani "oq ekran"ga aylantirib qo'yadi.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary tutib oldi:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-950 px-6">
          <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h1 className="font-display text-xl font-bold text-ink dark:text-gray-100 mb-2">
              Nimadir noto'g'ri ketdi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Kutilmagan xatolik yuz berdi. Sahifani qayta yuklab ko'ring — agar
              muammo davom etsa, administrator bilan bog'laning.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky to-bubblegum text-white font-semibold px-5 py-2.5 hover:opacity-90 transition-all"
            >
              <RefreshCw size={16} />
              Sahifani qayta yuklash
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;