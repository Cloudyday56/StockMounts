
const Footer = () => {
  return (
    <footer className="bg-base-300 border-t border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            &copy; StockMounts - {new Date().getFullYear()}
          </div>
          <div>
            {/* GitHub */}
            <a
              href="https://github.com/Cloudyday56/StockMounts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <img
                src="/github-mark-white.svg"
                alt="GitHub"
                width={30}
                height={30}
                className="inline-block"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer