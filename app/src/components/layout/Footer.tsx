import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900">
                Offery
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              AI 驅動的智慧求職平台，幫助你更有效率地找到理想工作。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">產品</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  功能特色
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  方案價格
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">資源</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  求職指南
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  履歷範本
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  面試技巧
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">法律</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  隱私權政策
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  服務條款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Offery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
