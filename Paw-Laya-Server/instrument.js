import * as Sentry from '@sentry/node'; // Import Sentry
import { nodeProfilingIntegration } from '@sentry/profiling-node'; // Import profiling integration

// Initialize Sentry with your DSN and integrations
Sentry.init({
  dsn: 'https://68ab6a10a611e573267effb3d1a49517@o4508603140472832.ingest.de.sentry.io/4508625023205456',
  integrations: [nodeProfilingIntegration()],
  // Optional: Enable tracing if needed
  // tracesSampleRate: 1.0, // Capture 100% of the transactions
});

// Start the profiler
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
const transaction = Sentry.startSpan(
  {
    name: 'My First Transaction',
  },
  () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
  }
);

// Optionally stop profiling, but if you don't, it will keep profiling until the process exits
Sentry.profiler.stopProfiler();
