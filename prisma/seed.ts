import { runSeed } from "./seed/run"

runSeed().catch((error) => {
  console.error(error)
  process.exit(1)
})
