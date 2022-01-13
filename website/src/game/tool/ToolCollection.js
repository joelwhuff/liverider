export default class ToolCollection {
    constructor() {
        this.toolsByToolName = new Map();
        this.toolsByKeyLabel = new Map();
    }

    setTools(instances) {
        for (let tool in instances) {
            this.setTool(instances[tool]);
        }
    }

    setTool(instance) {
        this.toolsByToolName.set(instance.constructor.toolName, instance);
        this.toolsByKeyLabel.set(instance.constructor.keyLabel, instance);
    }

    getByToolName(toolName) {
        return this.toolsByToolName.get(toolName);
    }

    getByKeyLabel(keyLabel) {
        return this.toolsByKeyLabel.get(keyLabel);
    }
}
