import { createTemplate } from "../create_template.ts";
import type { PackageProps, PackagePropsPath } from "../types/mod.ts";

export const denoJsonc = createTemplate<PackagePropsPath, PackageProps>`{
	"name": "${"pkg.name"}",
  "description": "${"pkg.description"}",
  "version": "${"pkg.version"}",
  "author": "integereleven",
  "license": "MIT",
  "status": "${"pkg.status"}",
  "lint": {
    "rules": {
      "tags": ["recommended"],
      "include": [
        "ban-untagged-todo",
        "camelcase",
        "default-param-last",
        "eqeqeq",
        "explicit-function-return-type",
        "explicit-module-boundary-types",
        "no-throw-literal"
      ]
    }
  },
  "fmt": {
    "files": {
      "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.json"],
      "exclude": ["**/vendor/**", "**/build/**"]
    },
    "options": {
      "indentWidth": 2,
      "lineWidth": 80,
      "proseWrap": "preserve",
      "useTabs": false,
      "singleQuote": false,
      "semiColons": true
    }
  },
  "tasks": {
		"bump-version": "deno run -A https://denopkg.com/intv8/repo-svc/cli/bump_version.ts",
		"add-exception": "deno run -A https://denopkg.com/intv8/repo-svc/cli/add_exception.ts",
		"add-feature": "deno run -A https://denopkg.com/intv8/repo-svc/cli/add_feature.ts",
    "commit": "deno run -A https://denopkg.com/intv8/repo-svc/cli/commit.ts",
    "pre-commit": "deno fmt && deno lint && deno test && deno doc ./mod.ts --json > _doc.json",
    "cache": "deno cache --reload --lock=lock.json --lock-write deps.ts"
  }
}
`;
