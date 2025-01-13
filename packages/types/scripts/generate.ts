import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const TYPES_DIR = path.join(__dirname, '../src/generated');

// Ensure the generated directory exists
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

// Generate types from entities
const generateTypes = async () => {
  const command = `typeorm-model-generator -h localhost -d vocabuddy -p 5432 -u postgres -x postgres -e postgres -o ${TYPES_DIR}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Types generated successfully: ${stdout}`);

    // Clean up and format the generated files
    cleanupGeneratedTypes();
  });
};

const cleanupGeneratedTypes = () => {
  const files = fs.readdirSync(TYPES_DIR);
  
  files.forEach(file => {
    if (file.endsWith('.ts')) {
      const filePath = path.join(TYPES_DIR, file);
      let content = fs.readFileSync(filePath, 'utf8');

      // Remove TypeORM decorators
      content = content.replace(/@Entity\([^)]*\)/g, '');
      content = content.replace(/@Column\([^)]*\)/g, '');
      content = content.replace(/@PrimaryGeneratedColumn\([^)]*\)/g, '');
      content = content.replace(/@ManyToOne\([^)]*\)/g, '');
      content = content.replace(/@OneToMany\([^)]*\)/g, '');
      content = content.replace(/@JoinColumn\([^)]*\)/g, '');
      content = content.replace(/import.*typeorm.*;\n/g, '');

      // Convert class to interface
      content = content.replace(/export class/g, 'export interface');

      // Add export to index.ts
      fs.appendFileSync(
        path.join(TYPES_DIR, 'index.ts'),
        `export * from './${path.basename(file, '.ts')}';\n`
      );

      fs.writeFileSync(filePath, content);
    }
  });
};

generateTypes(); 