// utils/cosmosClient.ts
import { CosmosClient } from "@azure/cosmos";
import { ComponentMetadata } from "@/types/component";

// Initialize the Cosmos client
const endpoint = process.env.COSMOS_ENDPOINT || "";
const key = process.env.COSMOS_KEY || "";
const databaseId = process.env.COSMOS_DATABASE || "";
const containerId = process.env.COSMOS_CONTAINER || "";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// Define a default use case for component records (UI Blocks)
const DEFAULT_USE_CASE = "ui-blocks";

export { client, database, container };

export async function getComponents(filters?: {
  componentType?: 'base' | 'composite';
  businessType?: string[];
  style?: string[];
  features?: string[];
  searchText?: string;
}) {
  // Start query with the default useCase condition
  let query = "SELECT * FROM c WHERE c.useCase = @useCase";
  const queryParams: any[] = [{ name: "@useCase", value: DEFAULT_USE_CASE }];
  
  const conditions: string[] = [];
  
  if (filters) {
    if (filters.componentType) {
      conditions.push("c.componentType = @componentType");
      queryParams.push({ name: "@componentType", value: filters.componentType });
    }
    
    if (filters.businessType && filters.businessType.length > 0) {
      conditions.push("ARRAY_CONTAINS(@businessTypes, c.businessType)");
      queryParams.push({ name: "@businessTypes", value: filters.businessType });
    }
    
    if (filters.style && filters.style.length > 0) {
      conditions.push("ARRAY_CONTAINS(@styles, c.style)");
      queryParams.push({ name: "@styles", value: filters.style });
    }
    
    if (filters.features && filters.features.length > 0) {
      conditions.push("ARRAY_CONTAINS(@features, c.features)");
      queryParams.push({ name: "@features", value: filters.features });
    }
    
    if (filters.searchText) {
      conditions.push("(CONTAINS(LOWER(c.name), LOWER(@searchText)) OR CONTAINS(LOWER(c.description), LOWER(@searchText)))");
      queryParams.push({ name: "@searchText", value: filters.searchText.toLowerCase() });
    }
  }

  // Append additional conditions if any exist
  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  const querySpec = {
    query,
    parameters: queryParams
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources as ComponentMetadata[];
}

export async function getComponentById(id: string) {
  // Use the default useCase as the partition key when reading the item
  const { resource } = await container.item(id, DEFAULT_USE_CASE).read();
  return resource as ComponentMetadata;
}

export async function createComponent(componentData: Omit<ComponentMetadata, 'id' | 'createdAt' | 'updatedAt'>) {
  const timestamp = new Date().toISOString();
  // Add the useCase property to ensure the record is stored under the correct partition
  const newComponent: ComponentMetadata = {
    id: `component-${Date.now()}`,
    ...componentData,
    useCase: DEFAULT_USE_CASE,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  // If you want to ensure defaultProps is always an object (even if empty)
  if (!newComponent.defaultProps) {
    newComponent.defaultProps = {};
  }

  const { resource } = await container.items.create(newComponent);
  return resource as ComponentMetadata;
}

export async function updateComponent(id: string, componentData: Partial<ComponentMetadata>) {
  const existingComponent = await getComponentById(id);
  
  if (!existingComponent) {
    throw new Error(`Component with id ${id} not found`);
  }

  const updatedComponent = {
    ...existingComponent,
    ...componentData,
    updatedAt: new Date().toISOString()
  };

  if (componentData.defaultProps === undefined && !existingComponent.defaultProps) {
    updatedComponent.defaultProps = {};
  }

  // Use the default useCase as the partition key for the replace operation
  const { resource } = await container.item(id, DEFAULT_USE_CASE).replace(updatedComponent);
  return resource as ComponentMetadata;
}

export async function deleteComponent(id: string) {
  // Use the default useCase as the partition key for deletion
  await container.item(id, DEFAULT_USE_CASE).delete();
}

export async function getComponentOptions() {
  // Return the available options for dropdowns
  return {
    businessTypes: [
      "Services", 
      "Portfolio", 
      "Personal Website", 
      "Consulting", 
      "Professional Services", 
      "Educational",
      "E-commerce"
    ],
    styles: [
      "Modern & Professional", 
      "Minimal & Elegant", 
      "Clean & Simple", 
      "Sophisticated & Refined",
      "Bold & Creative"
    ],
    features: [
      "Contact Form", 
      "Booking System", 
      "Newsletter Integration", 
      "Blog functionality",
      "Authentication",
      "E-commerce Features"
    ]
  };
}
