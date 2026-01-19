#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Paths
const SCHEMA_FILE = path.join(__dirname, "../schemas/kit.schema.json");
const KITS_DIR = path.join(__dirname, "../kits");

// Load schema
let schema;
try {
  schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, "utf8"));
} catch (err) {
  console.error(`❌ Failed to load schema from ${SCHEMA_FILE}: ${err.message}`);
  process.exit(1);
}

// Validation state
let errors = [];
let warnings = [];
let slugSet = new Set();

// Helper: Validate URL format
function isValidUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Helper: Validate GitHub repository URL format
function isValidGitHubRepoUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.includes("github.com");
  } catch {
    return false;
  }
}

// Helper: Validate date format (YYYY-MM-DD)
function isValidDate(dateStr) {
  if (!dateStr) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Helper: Validate slug pattern
function isValidSlug(slug) {
  if (!slug) return false;
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

// Helper: Get enum values from schema
function getEnumValues(propertyName) {
  const propSchema = schema.properties[propertyName];
  return propSchema && propSchema.enum ? propSchema.enum : [];
}

// Helper: Check if field is required
function isRequired(field) {
  return schema.required.includes(field);
}

// Helper: Check if property exists in schema
function isKnownProperty(prop) {
  return Object.keys(schema.properties).includes(prop);
}

// Validate a single kit object
function validateKit(kit, filePath) {
  // Check for unknown properties (schema validation: additionalProperties: false)
  const knownProps = Object.keys(schema.properties);
  for (const prop of Object.keys(kit)) {
    if (!knownProps.includes(prop)) {
      errors.push(`${filePath}: Unknown property '${prop}' (not allowed by schema)`);
    }
  }

  // Validate required fields
  for (const field of schema.required) {
    if (!(field in kit)) {
      errors.push(`${filePath}: Missing required field '${field}'`);
    }
  }

  // Validate each field
  for (const [key, value] of Object.entries(kit)) {
    const propSchema = schema.properties[key];
    if (!propSchema) continue;

    // Validate type
    const expectedType = propSchema.type;
    const actualType = Array.isArray(value) ? "array" : typeof value;

    if (expectedType === "array" && actualType !== "array") {
      errors.push(`${filePath}: Field '${key}' must be an array, got ${actualType}`);
    } else if (expectedType === "string" && actualType !== "string") {
      errors.push(`${filePath}: Field '${key}' must be a string, got ${actualType}`);
    } else if (expectedType === "object" && actualType !== "object") {
      errors.push(`${filePath}: Field '${key}' must be an object, got ${actualType}`);
    }

    // String-specific validations
    if (actualType === "string") {
      // Max length validation
      if (propSchema.maxLength && value.length > propSchema.maxLength) {
        errors.push(`${filePath}: Field '${key}' exceeds max length of ${propSchema.maxLength}`);
      }

      // Enum validation
      if (propSchema.enum && !propSchema.enum.includes(value)) {
        errors.push(`${filePath}: Field '${key}' has invalid value '${value}'. Must be one of: ${propSchema.enum.join(", ")}`);
      }

      // Date format validation
      if (propSchema.format === "date" && !isValidDate(value)) {
        errors.push(`${filePath}: Field '${key}' must be in YYYY-MM-DD format, got '${value}'`);
      }

      // URI/URL validation
      if (propSchema.format === "uri" && !isValidUrl(value)) {
        errors.push(`${filePath}: Field '${key}' must be a valid URL, got '${value}'`);
      }

      // GitHub repository URL validation for repo field
      if (key === "repo" && !isValidGitHubRepoUrl(value)) {
        errors.push(`${filePath}: Field 'repo' must be a valid GitHub URL, got '${value}'`);
      }

      // Slug pattern validation
      if (key === "slug" && !isValidSlug(value)) {
        errors.push(`${filePath}: Field 'slug' must match pattern ^[a-z0-9]+(-[a-z0-9]+)*$, got '${value}'`);
      }
    }

    // Array-specific validations
    if (actualType === "array") {
      if (propSchema.minItems && value.length < propSchema.minItems) {
        errors.push(`${filePath}: Field '${key}' must have at least ${propSchema.minItems} items, got ${value.length}`);
      }
      if (value.length === 0) {
        errors.push(`${filePath}: Field '${key}' cannot be empty`);
      }
    }

    // Object-specific validations (nested)
    if (actualType === "object" && propSchema.properties) {
      // Validate stack object
      if (key === "stack") {
        if (!value.language || !Array.isArray(value.language) || value.language.length === 0) {
          errors.push(`${filePath}: stack.language is required and must be a non-empty array`);
        }
      }
      // Validate requirements object
      if (key === "requirements") {
        const allowedReqs = ["node", "python", "docker"];
        for (const reqKey of Object.keys(value)) {
          if (!allowedReqs.includes(reqKey)) {
            warnings.push(`${filePath}: Unknown requirement '${reqKey}'. Allowed: ${allowedReqs.join(", ")}`);
          }
        }
      }
    }
  }

  // Validate type field matches directory structure
  const expectedDir = path.basename(path.dirname(filePath));
  if (kit.type && kit.type !== expectedDir) {
    errors.push(`${filePath}: Kit type '${kit.type}' does not match directory '${expectedDir}'`);
  }

  // Check for slug uniqueness
  if (kit.slug) {
    if (slugSet.has(kit.slug)) {
      errors.push(`${filePath}: Duplicate slug '${kit.slug}'. Slugs must be unique across all kits.`);
    } else {
      slugSet.add(kit.slug);
    }
  }
}

// Recursively get all JSON files in a directory
function getJsonFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory does not exist: ${dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getJsonFiles(fullPath, fileList);
    } else if (file.endsWith(".json")) {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

// Get target path from command line arguments
function getTargetPath() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    return KITS_DIR; // Default: validate all kits
  }
  const target = args[0];
  if (fs.existsSync(target)) {
    return target;
  }
  const fullPath = path.join(__dirname, "..", target);
  if (fs.existsSync(fullPath)) {
    return fullPath;
  }
  console.error(`❌ Path not found: ${target}`);
  process.exit(1);
}

// Main validation function
function validate() {
  const targetPath = getTargetPath();
  const stat = fs.statSync(targetPath);

  let kitFiles = [];

  if (stat.isDirectory()) {
    console.log(`📂 Validating kits in: ${targetPath}`);
    kitFiles = getJsonFiles(targetPath);
  } else if (stat.isFile() && targetPath.endsWith(".json")) {
    console.log(`📄 Validating kit file: ${targetPath}`);
    kitFiles = [targetPath];
  } else {
    console.error(`❌ Invalid target. Must be a directory or .json file`);
    process.exit(1);
  }

  if (kitFiles.length === 0) {
    console.error(`❌ No JSON files found in: ${targetPath}`);
    process.exit(1);
  }

  console.log(`\n📋 Found ${kitFiles.length} kit file(s) to validate\n`);

  // Validate each kit file
  kitFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const kit = JSON.parse(content);
      validateKit(kit, filePath);
    } catch (err) {
      errors.push(`${filePath}: Failed to parse JSON - ${err.message}`);
    }
  });

  // Report results
  console.log("═══════════════════════════════════════");

  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach(error => console.log(`   ${error}`));
    console.log("\n═══════════════════════════════════════");
    console.log(`\n❌ Validation failed with ${errors.length} error(s)`);
    process.exit(1);
  } else {
    console.log("\n✅ All validations passed!");
    console.log(`   ${kitFiles.length} kit file(s) validated successfully`);
    console.log(`   ${slugSet.size} unique slug(s) verified`);
    console.log("\n═══════════════════════════════════════");
  }
}

// Run validation
validate();
