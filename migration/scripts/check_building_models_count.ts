import { BUILDING_MODELS } from '../../src/data/models';
import { matchProductCategory } from '../../src/utils/categoryMatching';

console.log('Total items in BUILDING_MODELS:', BUILDING_MODELS.length);

const modularInModels = BUILDING_MODELS.filter(m => matchProductCategory(m, 'Modular Homes'));
console.log('Modular Homes in BUILDING_MODELS:', modularInModels.length);
modularInModels.forEach(m => console.log(` - [${m.category}] ${m.slug} | ${m.name}`));

const prefabInModels = BUILDING_MODELS.filter(m => matchProductCategory(m, 'Prefab Homes'));
console.log('\nPrefab Homes in BUILDING_MODELS:', prefabInModels.length);
prefabInModels.forEach(m => console.log(` - [${m.category}] ${m.slug} | ${m.name}`));
