import { execSync } from 'node:child_process';

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

try {
  run('git add -f dist');
  const tree = run('git write-tree --prefix=dist');
  console.log('Tree:', tree);
  const commit = run(`git commit-tree ${tree} -m "deploy: integrate Alibaba page-agent with user UI"`);
  console.log('Commit:', commit);
  run(`git push origin ${commit}:refs/heads/gh-pages --force`);
  run('git reset HEAD dist');
  console.log('Successfully deployed to gh-pages!');
} catch (err) {
  console.error('Deploy failed:', err);
  process.exit(1);
}
