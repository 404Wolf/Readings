"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  default: () => MyPlugin
});
module.exports = __toCommonJS(plugin_exports);
var import_obsidian2 = require("obsidian");
var import_os = require("os");
var path = __toESM(require("path"), 1);
var fs = __toESM(require("fs/promises"), 1);

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  reSnapPath: "reSnap",
  reSnapExtraArgs: ["-c"],
  invertRemarkableImages: false,
  outputPath: "Remarkable",
  rmAddress: "10.11.99.1",
  rmSshKeyAddress: "~/.ssh/remarkable",
  postprocessor: "",
  imageTag: "remarkable"
};
var SettingsTab = class extends import_obsidian.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display = () => {
    let { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Obsidian & reMarkable" });
    new import_obsidian.Setting(containerEl).setName("reMarkable IP").setDesc(
      "The IP address of your reMarkable. Use 10.11.99.1 and connect via cable if unsure."
    ).addText(
      (text) => text.setPlaceholder("Example: 10.11.99.1").setValue(this.plugin.settings.rmAddress).onChange(async (value) => {
        this.plugin.settings.rmAddress = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("SSH key").setDesc("The private ssh key for authing into the remarkable").addText(
      (text) => text.setPlaceholder("/home/name/.ssh/something").setValue(this.plugin.settings.rmSshKeyAddress)
    );
    new import_obsidian.Setting(containerEl).setName("reSnap executable").setDesc("The path to the reSnap executable if it's not in $PATH").addText(
      (text) => text.setPlaceholder("reSnap path if not in $PATH").setValue(this.plugin.settings.reSnapPath).onChange(async (value) => {
        this.plugin.settings.reSnapPath = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("reSnap extra arguments").setDesc("Extra arguments to pass to reSnap").addText(
      (text) => text.setPlaceholder("Extra arguments").setValue(this.plugin.settings.reSnapExtraArgs.join(" ")).onChange(async (value) => {
        this.plugin.settings.reSnapExtraArgs = value.split(" ");
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Output folder").setDesc("The folder where rM drawing images should be stored").addText(
      (text) => text.setPlaceholder("Folder in vault").setValue(this.plugin.settings.outputPath)
    );
    new import_obsidian.Setting(containerEl).setName("Postprocessing executable").setDesc(
      "The absolute path to an executable that post-processes the captured image. The script will be passed the filename and should overwrite the file with a modified version."
    ).addText(
      (text) => text.setPlaceholder("Path or executable name").setValue(this.plugin.settings.postprocessor).onChange(async (value) => {
        this.plugin.settings.postprocessor = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Image tag").setDesc("The tag to use for images inserted from the reMarkable. ").addText(
      (text) => text.setPlaceholder("remarkable").setValue(this.plugin.settings.imageTag).onChange(async (value) => {
        this.plugin.settings.imageTag = value;
        await this.plugin.saveSettings();
      })
    );
  };
};

// src/resnap/index.ts
var import_child_process = require("child_process");
var import_util = require("util");
var execFile = (0, import_util.promisify)(import_child_process.execFile);
async function getNoteFileMetadataJson(noteFileMetadataPath, { rmAddress, reSnapSshkey }) {
  return JSON.parse(
    (await execFile("ssh", [
      `root@${rmAddress}`,
      "-i",
      reSnapSshkey,
      `cat '/home/root/.local/share/remarkable/xochitl/${noteFileMetadataPath}.metadata'`
    ])).stdout
  );
}
async function getCurrentNotePath(reSnapOutput, args) {
  const noteFileMetadataJson = await getNoteFileMetadataJson(
    reSnapOutput,
    args
  );
  const getNoteFilePath = async (noteFileMetadataJson2, noteFilePath) => {
    if (noteFileMetadataJson2.parent !== "")
      return getNoteFilePath(
        await getNoteFileMetadataJson(noteFileMetadataJson2.parent, args),
        `${noteFileMetadataJson2.visibleName}/${noteFilePath}`
      );
    else return noteFilePath;
  };
  const currentNotePath = await getNoteFilePath(
    noteFileMetadataJson,
    noteFileMetadataJson.visibleName
  );
  return currentNotePath.replace(/\/[^/]*$/, "");
}
async function callReSnap(args) {
  const reSnapOutput = (await execFile(args.reSnapPath, [
    "-k",
    args.reSnapSshkey,
    "-n",
    "-s",
    args.rmAddress,
    "-o",
    args.outputPath,
    ...args.reSnapExtraArgs
  ])).stdout.replace("\n", "");
  if (args.postProcess.length > 0) {
    const postProcessOutput = await execFile(args.postProcess, [
      args.outputPath,
      ...args.postProcessExtraArgs || []
    ]);
    console.log("Postprocess output:", postProcessOutput.stdout);
    if (postProcessOutput.stderr)
      console.error("Postprocess stderr:", postProcessOutput.stderr);
  }
  return {
    notePath: await getCurrentNotePath(reSnapOutput, args),
    noteMetadata: await getNoteFileMetadataJson(reSnapOutput, args)
  };
}

// src/plugin.ts
var MyPlugin = class extends import_obsidian2.Plugin {
  settings = DEFAULT_SETTINGS;
  onload = async () => {
    await this.loadSettings();
    const plugin = this;
    this.addCommand({
      id: "insert-remarkable-drawing-cropped",
      name: "Insert a cropped drawing from the reMarkable",
      callback: () => {
        plugin.tryInsertingDrawing(true);
      }
    });
    this.addCommand({
      id: "insert-remarkable-drawing-no-crop",
      name: "Insert an uncropped drawing from the reMarkable",
      callback: () => {
        plugin.tryInsertingDrawing(false);
      }
    });
    this.addSettingTab(new SettingsTab(this.app, this));
  };
  loadSettings = async () => {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  };
  saveSettings = async () => {
    await this.saveData(this.settings);
  };
  tryInsertingDrawing = async (crop) => {
    new import_obsidian2.Notice("Inserting rM drawing...", 1e3);
    try {
      const fileName = `${crypto.randomUUID()}.png`;
      const outputFilePath = path.join((0, import_os.tmpdir)(), fileName);
      const { noteMetadata, notePath } = await callReSnap({
        rmAddress: this.settings.rmAddress,
        reSnapPath: this.settings.reSnapPath,
        reSnapSshkey: this.settings.rmSshKeyAddress,
        reSnapExtraArgs: this.settings.reSnapExtraArgs,
        outputPath: outputFilePath,
        postProcess: this.settings.postprocessor,
        postProcessExtraArgs: crop ? ["--crop"] : []
      });
      const resourceRoot = this.app.vault.getFolderByPath(
        this.settings.outputPath
      );
      if (resourceRoot === null)
        throw new Error("Could not find the resource root!");
      console.log("Resource root:", resourceRoot);
      const vaultImagePath = path.join(resourceRoot.path, fileName);
      console.log("Copying drawing to vault:", vaultImagePath);
      const vaultBasePath = await this.app.vault.adapter.basePath;
      console.log(vaultBasePath);
      const vaultResourceDumpPath = path.join(vaultBasePath, vaultImagePath);
      await fs.copyFile(outputFilePath, vaultResourceDumpPath);
      fs.unlink(outputFilePath).then(() => console.log("Deleted temporary file:", outputFilePath)).catch(
        (error) => console.error("Could not delete temporary file:", error)
      );
      let imageMarkdown = `![[${fileName}]]
\`Page ${noteMetadata.lastOpenedPage + 1} @ "${notePath}"\``;
      if (this.settings.imageTag != "")
        imageMarkdown += ` #${this.settings.imageTag}`;
      const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
      if (view) {
        const editor = view.editor;
        const cursor = editor.getCursor();
        editor.replaceRange(imageMarkdown, cursor);
      } else throw new Error("No markdown view found!");
    } catch (error) {
      new import_obsidian2.Notice(
        "Could not insert your rM drawing! Is your tablet connected and reachable at the configured address?"
      );
      throw error;
    }
  };
};
//# sourceMappingURL=main.js.map
