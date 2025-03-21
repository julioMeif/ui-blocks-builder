// types/component.ts
export interface ComponentMetadata {
    id: string;
    useCase: string;
    name: string;
    description: string;
    componentType: 'base' | 'composite';
    businessType: string[];
    style: string[];
    features: string[];
    props: {
      required: string[];
      optional: string[];
      types: Record<string, any>;
    };
    examples: { description: string; code: string }[];
    sourceCode: string;
    importStatement: string;
    createdAt: string;
    updatedAt: string;
    defaultProps?: Record<string, any>;
  }
  
  // Constants for dropdown options
  export const BUSINESS_TYPES = [
    "Services", 
    "Portfolio", 
    "Personal Website", 
    "Consulting", 
    "Professional Services", 
    "Educational",
    "E-commerce"
  ];
  
  export const STYLE_TYPES = [
    "Modern & Professional", 
    "Minimal & Elegant", 
    "Clean & Simple", 
    "Sophisticated & Refined",
    "Bold & Creative"
  ];
  
  export const FEATURE_TYPES = [
    "Contact Form", 
    "Booking System", 
    "Newsletter Integration", 
    "Blog functionality",
    "Authentication",
    "E-commerce Features"
  ];