import { CosmosClient } from "@azure/cosmos";

// Initialize the Cosmos client
const endpoint = process.env.COSMOS_ENDPOINT || "";
const key = process.env.COSMOS_KEY || "";
const databaseId = process.env.COSMOS_DATABASE || "";
const containerId = process.env.COSMOS_CONTAINER || "";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

export { client, database, container };

export interface UIBlock {
  id: string;
  name: string;
  type: 'base' | 'composite';
  category: string;
  metadata: {
    industry?: string[];
    tone?: string[];
    features?: string[];
    tags?: string[];
  };
  component: string;
  defaultProps: Record<string, any>;
  code: string; // Store the actual component code
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUIBlocks() {
  const querySpec = {
    query: "SELECT * from c"
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources as UIBlock[];
}

export async function getUIBlockById(id: string) {
  const { resource } = await container.item(id, id).read();
  return resource as UIBlock;
}

export async function createUIBlock(blockData: Omit<UIBlock, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = new Date().toISOString();
  const newBlock: UIBlock = {
    id: `block-${Date.now()}`,
    ...blockData,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const { resource } = await container.items.create(newBlock);
  return resource;
}

export async function updateUIBlock(id: string, blockData: Partial<UIBlock>) {
  const existingBlock = await getUIBlockById(id);
  
  if (!existingBlock) {
    throw new Error(`Block with id ${id} not found`);
  }

  const updatedBlock = {
    ...existingBlock,
    ...blockData,
    updatedAt: new Date().toISOString()
  };

  const { resource } = await container.item(id, id).replace(updatedBlock);
  return resource;
}

export async function deleteUIBlock(id: string) {
  await container.item(id, id).delete();
}