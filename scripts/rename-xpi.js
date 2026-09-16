// web-ext sign names the downloaded .xpi after the AMO upload, not our
// project name, so we rename it to a stable "suap_ifto.xpi" that the
// README always links to.
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "web-ext-artifacts");
const target = path.join(dir, "suap_ifto.xpi");

const files = fs
	.readdirSync(dir)
	.filter((f) => f.endsWith(".xpi") && f !== "suap_ifto.xpi")
	.map((f) => ({ f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
	.sort((a, b) => b.mtime - a.mtime);

if (files.length === 0) {
	throw new Error("Nenhum .xpi novo encontrado em web-ext-artifacts/ para renomear.");
}

fs.renameSync(path.join(dir, files[0].f), target);
console.log(`Renomeado ${files[0].f} -> suap_ifto.xpi`);
