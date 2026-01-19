#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Paths
const KITS_DIR = path.join(__dirname, "../kits");
const OUTPUT_FILE = path.join(__dirname, "../index.json");

// Helper: Recursively get all JSON files in a directory
function getJsonFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory does not exist: ${dir}`);
    process.exit(1);
  }

  let files = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getJsonFiles(fullPath));
    } else if (item.endsWith(".json")) {
      files.push(fullPath);
    }
  });

  return files;
}

// Helper: Validate a kit object before including in index
function isValidKit(kit) {
  const requiredFields = ["name", "slug", "repo", "type", "stack", "features", "difficulty", "status", "license", "maintainers", "created_at", "last_updated"];

  for (const field of requiredFields) {
    if (!kit[field]) {
      console.error(`⚠️  Skipping kit with missing required field: ${field}`);
      return false;
    }
  }

  return true;
}

// Helper: Extract relevant fields for index
function extractIndexData(kit) {
  return {
    name: kit.name,
    slug: kit.slug,
    type: kit.type,
    repo: kit.repo,
    description: kit.description || "",
    tags: kit.tags || [],
    difficulty: kit.difficulty,
    status: kit.status,
    maintainers: kit.maintainers,
    last_updated: kit.last_updated
  };
}

// Main index generation function
function generateIndex() {
  console.log("📂 Scanning for kit metadata files...\n");

  // Get all JSON kit files
  const kitFiles = getJsonFiles(KITS_DIR);

  if (kitFiles.length === 0) {
    console.error("❌ No kit metadata files found");
    process.exit(1);
  }

  console.log(`📋 Found ${kitFiles.length} kit file(s)\n`);

  // Read and parse all kits
  const kits = [];
  const slugs = new Set();
  let skippedCount = 0;

  kitFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const kit = JSON.parse(content);

      // Check for duplicate slugs
      if (kit.slug) {
        if (slugs.has(kit.slug)) {
          console.error(`⚠️  Skipping duplicate slug: ${kit.slug} in ${filePath}`);
          skippedCount++;
          return;
        }
        slugs.add(kit.slug);
      }

      // Validate kit before adding
      if (isValidKit(kit)) {
        kits.push(extractIndexData(kit));
      } else {
        skippedCount++;
      }
    } catch (err) {
      console.error(`⚠️  Skipping invalid JSON in ${filePath}: ${err.message}`);
      skippedCount++;
    }
  });

  if (kits.length === 0) {
    console.error("❌ No valid kits found to index");
    process.exit(1);
  }

  if (skippedCount > 0) {
    console.warn(`⚠️  Skipped ${skippedCount} invalid kit file(s)\n`);
  }

  // Sort kits by type and name for consistent ordering
  kits.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }
    return a.name.localeCompare(b.name);
  });

  // Generate category counts
  const categories = {};
  kits.forEach(kit => {
    categories[kit.type] = (categories[kit.type] || 0) + 1;
  });

  // Generate feature tags (collect all unique tags)
  const allTags = new Set();
  kits.forEach(kit => {
    if (kit.tags && Array.isArray(kit.tags)) {
      kit.tags.forEach(tag => allTags.add(tag.toLowerCase()));
    }
  });

  // Generate difficulty distribution
  const difficulty = {};
  kits.forEach(kit => {
    difficulty[kit.difficulty] = (difficulty[kit.difficulty] || 0) + 1;
  });

  // Generate status distribution
  const status = {};
  kits.forEach(kit => {
    status[kit.status] = (status[kit.status] || 0) + 1;
  });

  // Generate technology stacks summary
  const stacks = {
    languages: {},
    frontends: {},
    backends: {},
    databases: {},
    infrastructures: {}
  };

  // Re-read full kit data to extract stack information
  kitFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const kit = JSON.parse(content);

      if (kit.stack) {
        if (kit.stack.language) {
          kit.stack.language.forEach(lang => {
            stacks.languages[lang] = (stacks.languages[lang] || 0) + 1;
          });
        }
        if (kit.stack.frontend) {
          kit.stack.frontend.forEach(f => {
            stacks.frontends[f] = (stacks.frontends[f] || 0) + 1;
          });
        }
        if (kit.stack.backend) {
          kit.stack.backend.forEach(b => {
            stacks.backends[b] = (stacks.backends[b] || 0) + 1;
          });
        }
        if (kit.stack.database) {
          kit.stack.database.forEach(d => {
            stacks.databases[d] = (stacks.databases[d] || 0) + 1;
          });
        }
        if (kit.stack.infrastructure) {
          kit.stack.infrastructure.forEach(i => {
            stacks.infrastructures[i] = (stacks.infrastructures[i] || 0) + 1;
          });
        }
      }
    } catch (err) {
      // Already handled, skip
    }
  });

  // Build final index object
  const index = {
    generated_at: new Date().toISOString().split("T")[0],
    total_kits: kits.length,
    categories,
    difficulty,
    status,
    tags: Array.from(allTags).sort(),
    stacks,
    kits
  };

  // Write to file
  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), "utf8");
    console.log("═══════════════════════════════════════");
    console.log(`✅ index.json generated successfully`);
    console.log(`   Location: ${OUTPUT_FILE}`);
    console.log(`   Total kits: ${index.total_kits}`);
    console.log(`   Categories: ${Object.keys(index.categories).length}`);
    console.log(`   Tags: ${index.tags.length}`);
    console.log("═══════════════════════════════════════");
  } catch (err) {
    console.error(`❌ Failed to write index.json: ${err.message}`);
    process.exit(1);
  }
}

// Run index generation
generateIndex();
