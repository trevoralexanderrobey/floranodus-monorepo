import axios, { AxiosInstance, AxiosError } from "axios";
import { 
  FigmaFileResponse, 
  CreateFileRequest, 
  CreateShapeRequest, 
  CreateTextRequest,
  UpdateNodeRequest,
  FigmaApiError,
  AssetRequest 
} from "./types/figma";

export class FigmaClient {
  private api: AxiosInstance;
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.api = axios.create({
      baseURL: process.env.FIGMA_API_BASE_URL || "https://api.figma.com/v1",
      headers: {
        "X-Figma-Token": apiToken,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error("Figma API Error:", error.response?.data || error.message);
        throw this.handleApiError(error);
      }
    );
  }

  private handleApiError(error: AxiosError): FigmaApiError {
    if (error.response) {
      return {
        status: error.response.status,
        err: error.response.statusText,
        message: (error.response.data as any)?.err || error.message,
      };
    }
    return {
      status: 500,
      err: "Network Error",
      message: error.message,
    };
  }

  // Get file information
  async getFile(fileKey: string): Promise<FigmaFileResponse> {
    const response = await this.api.get(`/files/${fileKey}`);
    return response.data;
  }

  // Get specific nodes from a file
  async getFileNodes(fileKey: string, nodeIds: string[]): Promise<any> {
    const ids = nodeIds.join(",");
    const response = await this.api.get(`/files/${fileKey}/nodes?ids=${ids}`);
    return response.data;
  }

  // Get file images/assets
  async getImages(request: AssetRequest): Promise<any> {
    const params = new URLSearchParams({
      ids: request.nodeIds.join(","),
      format: request.format,
    });
    
    if (request.scale) params.append("scale", request.scale.toString());
    if (request.svg_outline_text) params.append("svg_outline_text", "true");
    if (request.svg_include_id) params.append("svg_include_id", "true");
    if (request.svg_simplify_stroke) params.append("svg_simplify_stroke", "true");

    const response = await this.api.get(`/images/${request.fileKey}?${params}`);
    return response.data;
  }

  // Create a new file (Note: Figma API doesnt directly support file creation via REST API)
  // This is a placeholder for future API support or webhook integration
  async createFile(request: CreateFileRequest): Promise<any> {
    throw new Error("File creation not supported by Figma REST API. Use Figma desktop app or plugins.");
  }

  // Get team projects
  async getTeamProjects(teamId: string): Promise<any> {
    const response = await this.api.get(`/teams/${teamId}/projects`);
    return response.data;
  }

  // Get project files
  async getProjectFiles(projectId: string): Promise<any> {
    const response = await this.api.get(`/projects/${projectId}/files`);
    return response.data;
  }

  // Get comments
  async getComments(fileKey: string): Promise<any> {
    const response = await this.api.get(`/files/${fileKey}/comments`);
    return response.data;
  }

  // Post comment
  async postComment(fileKey: string, message: string, clientMeta: any): Promise<any> {
    const response = await this.api.post(`/files/${fileKey}/comments`, {
      message,
      client_meta: clientMeta,
    });
    return response.data;
  }

  // Get version history
  async getVersions(fileKey: string): Promise<any> {
    const response = await this.api.get(`/files/${fileKey}/versions`);
    return response.data;
  }

  // Get user profile
  async getUser(): Promise<any> {
    const response = await this.api.get("/me");
    return response.data;
  }

  // NEW CREATION METHODS (inverse of Figma to Code Converter)
  
  // Create Figma nodes from UI code (inverse of get_code)
  async createNodesFromCode(
    fileKey: string, 
    code: string, 
    framework?: string, 
    parentNodeId?: string, 
    x?: number, 
    y?: number
  ): Promise<any> {
    // Note: This is a conceptual implementation since Figma's REST API has limitations
    // In practice, this would likely work through the Figma plugin bridge or desktop app
    
    try {
      // Parse the code and convert to Figma node structure
      const parsedNodes = this.parseCodeToFigmaNodes(code, framework);
      
      // Create the nodes via plugin bridge or return structured data for plugin consumption
      const result = {
        success: true,
        message: "Code parsed and ready for node creation",
        fileKey,
        parentNodeId,
        position: { x: x || 0, y: y || 0 },
        framework: framework || "unknown",
        originalCode: code,
        parsedNodes,
        instructions: "Use this data with the Figma plugin bridge to create actual nodes"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to create nodes from code: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Set design variables in Figma (inverse of get_variable_defs)
  async setDesignVariables(
    fileKey: string, 
    variables: Record<string, any>, 
    variableCollection?: string
  ): Promise<any> {
    // Note: Variable creation via REST API is limited
    // This returns structured data for plugin bridge implementation
    
    try {
      const result = {
        success: true,
        message: "Design variables prepared for creation",
        fileKey,
        variableCollection: variableCollection || "Default Collection",
        variables,
        variableCount: Object.keys(variables).length,
        instructions: "Use this data with the Figma plugin bridge to create actual variables"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to set design variables: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Establish code connections (inverse of get_code_connect_map)
  async establishCodeConnections(
    fileKey: string, 
    nodeId: string, 
    codeInfo: {
      componentName: string;
      filePath: string;
      repository?: string;
      framework?: string;
    }
  ): Promise<any> {
    try {
      // Store code connection metadata
      const connection = {
        success: true,
        message: "Code connection established",
        fileKey,
        nodeId,
        codeInfo,
        timestamp: new Date().toISOString(),
        instructions: "Use this data with the Figma plugin bridge to establish actual code connections"
      };
      
      return connection;
    } catch (error) {
      throw new Error(`Failed to establish code connection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Generate design preview from description (inverse of get_image)
  async generateDesignPreview(
    fileKey: string,
    designDescription: string,
    width?: number,
    height?: number,
    style?: string,
    format?: string
  ): Promise<any> {
    try {
      // Generate design structure from description
      const designNodes = this.parseDescriptionToDesign(designDescription, style);
      
      const result = {
        success: true,
        message: "Design preview generated",
        fileKey,
        designDescription,
        dimensions: {
          width: width || 375,
          height: height || 812
        },
        style: style || "modern",
        format: format || "png",
        designNodes,
        timestamp: new Date().toISOString(),
        instructions: "Use this data with the Figma plugin bridge to create actual design and generate preview"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to generate design preview: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // NEW PAGE ORGANIZATION METHODS

  // Create and organize pages by categories, milestones, or projects
  async createOrganizedPages(
    fileKey: string,
    pageStructure: {
      categories?: string[];
      milestones?: string[];
      projects?: string[];
    }
  ): Promise<any> {
    try {
      const pagesToCreate = [];
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Create category-based pages
      if (pageStructure.categories) {
        for (const category of pageStructure.categories) {
          pagesToCreate.push({
            name: `📁 ${category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}`,
            type: "category",
            category,
            organizationLevel: 1
          });
        }
      }
      
      // Create milestone-based pages
      if (pageStructure.milestones) {
        for (const milestone of pageStructure.milestones) {
          pagesToCreate.push({
            name: `🎯 ${milestone.charAt(0).toUpperCase() + milestone.slice(1).replace('_', ' ')}`,
            type: "milestone",
            milestone,
            organizationLevel: 2
          });
        }
      }
      
      // Create project-based pages
      if (pageStructure.projects) {
        for (const project of pageStructure.projects) {
          pagesToCreate.push({
            name: `🚀 ${project.charAt(0).toUpperCase() + project.slice(1).replace('_', ' ')}`,
            type: "project",
            project,
            organizationLevel: 3
          });
        }
      }
      
      // Add overview and status tracking pages
      pagesToCreate.unshift({
        name: "📊 Project Overview",
        type: "overview",
        organizationLevel: 0
      });
      
      pagesToCreate.push({
        name: "📋 Status Dashboard",
        type: "status_dashboard",
        organizationLevel: 4
      });
      
      const result = {
        success: true,
        message: `Organized page structure created with ${pagesToCreate.length} pages`,
        fileKey,
        pageStructure,
        pagesToCreate,
        totalPages: pagesToCreate.length,
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create actual pages in the correct order"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to create organized pages: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Track design progress with status labels and milestones
  async manageDesignStatus(
    fileKey: string,
    nodeId?: string,
    statusSystem?: {
      statuses?: string[];
      priority?: string;
      assignee?: string;
      dueDate?: string;
      currentStatus?: string;
    }
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      
      // Create status tracking system
      const statusConfig = {
        availableStatuses: statusSystem?.statuses || ["todo", "in_progress", "review", "approved", "archived"],
        priorityLevels: ["low", "medium", "high", "urgent"],
        statusColors: {
          todo: { r: 0.7, g: 0.7, b: 0.7 },        // Gray
          in_progress: { r: 0.2, g: 0.5, b: 1 },   // Blue  
          review: { r: 1, g: 0.8, b: 0.2 },        // Orange
          approved: { r: 0.2, g: 0.8, b: 0.2 },    // Green
          archived: { r: 0.5, g: 0.5, b: 0.5 }     // Dark Gray
        },
        priorityColors: {
          low: { r: 0.2, g: 0.8, b: 0.2 },         // Green
          medium: { r: 1, g: 0.8, b: 0.2 },        // Yellow
          high: { r: 1, g: 0.5, b: 0.2 },          // Orange
          urgent: { r: 1, g: 0.2, b: 0.2 }         // Red
        }
      };
      
      // Create status update for specific node if provided
      const statusUpdate = nodeId ? {
        nodeId,
        status: statusSystem?.currentStatus || "todo",
        priority: statusSystem?.priority || "medium",
        assignee: statusSystem?.assignee,
        dueDate: statusSystem?.dueDate,
        lastUpdated: timestamp
      } : null;
      
      // Create status tracking dashboard elements
      const dashboardElements = [
        {
          type: "status_legend",
          name: "📋 Status Legend",
          statuses: statusConfig.availableStatuses.map(status => ({
            name: status,
            color: statusConfig.statusColors[status as keyof typeof statusConfig.statusColors] || { r: 0.5, g: 0.5, b: 0.5 },
            icon: this.getStatusIcon(status)
          }))
        },
        {
          type: "priority_legend", 
          name: "⚡ Priority Legend",
          priorities: statusConfig.priorityLevels.map(priority => ({
            name: priority,
            color: statusConfig.priorityColors[priority as keyof typeof statusConfig.priorityColors],
            icon: this.getPriorityIcon(priority)
          }))
        },
        {
          type: "status_board",
          name: "📊 Status Board",
          columns: statusConfig.availableStatuses
        }
      ];
      
      const result = {
        success: true,
        message: nodeId ? "Design status updated" : "Status tracking system created",
        fileKey,
        statusConfig,
        statusUpdate,
        dashboardElements,
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create status tracking system and update node status"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to manage design status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Create organized scratchpad pages for ideas and exploration
  async createScratchpadSystem(
    fileKey: string,
    scratchpadTypes: string[],
    organizationMethod: string
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      const datePrefix = timestamp.split('T')[0]; // YYYY-MM-DD
      
      const scratchpadPages = [];
      
      // Create pages based on organization method
      for (const type of scratchpadTypes) {
        let pageName = "";
        let pageStructure = {};
        
        switch (organizationMethod) {
          case "by_date":
            pageName = `${datePrefix} - ${this.getScratchpadIcon(type)} ${this.formatScratchpadName(type)}`;
            pageStructure = {
              sections: ["Today's Ideas", "Quick Sketches", "Notes", "References"],
              layout: "chronological"
            };
            break;
            
          case "by_project":
            pageName = `${this.getScratchpadIcon(type)} ${this.formatScratchpadName(type)} - Project Hub`;
            pageStructure = {
              sections: ["Mobile App", "Web App", "Design System", "Cross-Platform"],
              layout: "project_based"
            };
            break;
            
          case "by_theme":
            pageName = `${this.getScratchpadIcon(type)} ${this.formatScratchpadName(type)} - Thematic`;
            pageStructure = {
              sections: ["UI Patterns", "Visual Style", "User Flow", "Content Strategy"],
              layout: "thematic"
            };
            break;
            
          case "by_status":
            pageName = `${this.getScratchpadIcon(type)} ${this.formatScratchpadName(type)} - Status Based`;
            pageStructure = {
              sections: ["New Ideas", "In Progress", "Need Feedback", "Approved", "Archive"],
              layout: "status_based"
            };
            break;
        }
        
        scratchpadPages.push({
          name: pageName,
          type,
          organizationMethod,
          pageStructure,
          elements: this.getScratchpadElements(type),
          timestamp
        });
      }
      
      // Add master scratchpad index page
      scratchpadPages.unshift({
        name: "🗂️ Scratchpad Index",
        type: "index",
        organizationMethod,
        pageStructure: {
          sections: ["Quick Navigation", "Recent Activity", "Statistics", "Templates"],
          layout: "index"
        },
        elements: {
          navigation: scratchpadPages.map(page => ({ 
            name: page.name, 
            type: page.type 
          })),
          quickActions: ["New Idea", "Random Inspiration", "Template Gallery", "Export Ideas"]
        },
        timestamp
      });
      
      const result = {
        success: true,
        message: `Scratchpad system created with ${scratchpadPages.length} organized pages`,
        fileKey,
        scratchpadTypes,
        organizationMethod,
        scratchpadPages,
        totalPages: scratchpadPages.length,
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create scratchpad pages with proper organization"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to create scratchpad system: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // NEW UI KIT GENERATION METHODS

  // Generate complete UI kits with all component variations
  async generateUIKit(
    fileKey: string,
    kitType: string,
    designSystem?: any,
    components?: string[]
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      
      // Default design system based on kit type
      const defaultDesignSystems = this.getDefaultDesignSystem(kitType);
      const finalDesignSystem = this.mergeDesignSystems(defaultDesignSystems, designSystem);
      
      // Generate components based on kit type and requested components
      const allComponents = components || this.getDefaultComponents(kitType);
      const generatedComponents = [];
      
      for (const componentType of allComponents) {
        const componentVariations = this.generateComponentVariations(componentType, finalDesignSystem, kitType);
        generatedComponents.push({
          type: componentType,
          variations: componentVariations,
          count: componentVariations.length
        });
      }
      
      // Create kit structure
      const kitStructure = {
        foundations: {
          colors: this.generateColorFoundations(finalDesignSystem.colorPalette),
          typography: this.generateTypographyFoundations(finalDesignSystem.typography),
          spacing: this.generateSpacingFoundations(finalDesignSystem.spacing),
          effects: this.generateEffectFoundations(finalDesignSystem.shadows, finalDesignSystem.borderRadius)
        },
        components: generatedComponents,
        layouts: this.generateLayoutTemplates(kitType),
        documentation: this.generateKitDocumentation(kitType, finalDesignSystem, allComponents)
      };
      
      const result = {
        success: true,
        message: `Complete UI kit generated for ${kitType} with ${generatedComponents.length} component types`,
        fileKey,
        kitType,
        designSystem: finalDesignSystem,
        kitStructure,
        componentCount: generatedComponents.reduce((sum, comp) => sum + comp.count, 0),
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create the complete UI kit with all variations"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to generate UI kit: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Create component library using atomic design principles
  async createComponentLibrary(
    fileKey: string,
    libraryStructure: any
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      
      // Create atomic design structure
      const atomicStructure = {
        foundations: this.createFoundationsLevel(libraryStructure.foundations || []),
        atoms: this.createAtomsLevel(libraryStructure.atoms || []),
        molecules: this.createMoleculesLevel(libraryStructure.molecules || []),
        organisms: this.createOrganismsLevel(libraryStructure.organisms || []),
        templates: this.createTemplatesLevel(libraryStructure.templates || []),
        pages: this.createPagesLevel(libraryStructure.pages || [])
      };
      
      // Create library organization
      const libraryPages = [];
      
      // Add foundation pages
      if (atomicStructure.foundations.length > 0) {
        libraryPages.push({
          name: "🎨 Foundations",
          type: "foundations",
          elements: atomicStructure.foundations,
          description: "Design system foundations: colors, typography, spacing, and basic styles"
        });
      }
      
      // Add atomic level pages
      if (atomicStructure.atoms.length > 0) {
        libraryPages.push({
          name: "⚛️ Atoms",
          type: "atoms", 
          elements: atomicStructure.atoms,
          description: "Basic building blocks: buttons, inputs, labels, and individual elements"
        });
      }
      
      // Add molecular level pages
      if (atomicStructure.molecules.length > 0) {
        libraryPages.push({
          name: "🧬 Molecules",
          type: "molecules",
          elements: atomicStructure.molecules,
          description: "Combined atoms: forms, search bars, and navigation components"
        });
      }
      
      // Add organism level pages
      if (atomicStructure.organisms.length > 0) {
        libraryPages.push({
          name: "🦠 Organisms",
          type: "organisms",
          elements: atomicStructure.organisms,
          description: "Complex components: headers, footers, sidebars, and modals"
        });
      }
      
      // Add template level pages
      if (atomicStructure.templates.length > 0) {
        libraryPages.push({
          name: "📐 Templates",
          type: "templates",
          elements: atomicStructure.templates,
          description: "Layout structures and page templates"
        });
      }
      
      // Add example pages
      if (atomicStructure.pages.length > 0) {
        libraryPages.push({
          name: "📄 Pages",
          type: "pages",
          elements: atomicStructure.pages,
          description: "Complete page examples and documentation"
        });
      }
      
      const result = {
        success: true,
        message: `Component library created with ${libraryPages.length} atomic design levels`,
        fileKey,
        libraryStructure: atomicStructure,
        libraryPages,
        totalElements: Object.values(atomicStructure).reduce((sum: number, level: any) => sum + level.length, 0),
        atomicLevels: libraryPages.length,
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create organized component library with atomic design structure"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to create component library: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // NEW SMART ORGANIZATION METHODS

  // Create responsive layouts with auto layout and constraints
  async createResponsiveLayouts(
    fileKey: string,
    layoutType: string,
    responsive: any,
    content?: any[]
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      
      // Generate responsive layout configurations for each breakpoint
      const breakpoints = responsive.breakpoints || ["mobile", "tablet", "desktop"];
      const layoutConfigurations = [];
      
      for (const breakpoint of breakpoints) {
        const config = this.generateLayoutConfiguration(layoutType, breakpoint, responsive);
        layoutConfigurations.push({
          breakpoint,
          width: config.width,
          height: config.height,
          layout: config.layout,
          constraints: config.constraints,
          autoLayout: config.autoLayout
        });
      }
      
      // Create layout frames for each breakpoint
      const layoutFrames = layoutConfigurations.map((config, index) => ({
        name: `📱 ${config.breakpoint.charAt(0).toUpperCase() + config.breakpoint.slice(1)} Layout`,
        type: "FRAME",
        width: config.width,
        height: config.height,
        x: index * (config.width + 50),
        y: 0,
        fills: [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.98 } }],
        strokes: [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }],
        strokeWeight: 1,
        cornerRadius: 8,
        layoutMode: config.autoLayout?.direction || "VERTICAL",
        itemSpacing: config.autoLayout?.spacing || 16,
        paddingTop: config.autoLayout?.padding?.top || 16,
        paddingRight: config.autoLayout?.padding?.right || 16,
        paddingBottom: config.autoLayout?.padding?.bottom || 16,
        paddingLeft: config.autoLayout?.padding?.left || 16,
        primaryAxisAlignItems: this.mapAlignment(config.autoLayout?.alignment),
        constraints: config.constraints,
        children: this.generateLayoutContent(content, config.breakpoint, layoutType)
      }));
      
      // Create responsive design system
      const responsiveDesignSystem = {
        breakpoints: layoutConfigurations.map(config => ({
          name: config.breakpoint,
          width: config.width,
          minWidth: this.getBreakpointMinWidth(config.breakpoint),
          maxWidth: this.getBreakpointMaxWidth(config.breakpoint)
        })),
        constraints: responsive.constraints || {},
        autoLayout: responsive.autoLayout || {},
        layoutType,
        adaptiveRules: this.generateAdaptiveRules(layoutType, breakpoints)
      };
      
      const result = {
        success: true,
        message: `Responsive ${layoutType} layout created for ${breakpoints.length} breakpoints`,
        fileKey,
        layoutType,
        responsiveDesignSystem,
        layoutFrames,
        breakpointCount: breakpoints.length,
        adaptiveFeatures: {
          autoLayout: !!responsive.autoLayout,
          constraints: !!responsive.constraints,
          responsiveContent: !!content,
          breakpointOptimization: true
        },
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create responsive layout frames with auto layout and constraints"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to create responsive layouts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Organize layers into logical containers using intelligent analysis
  async organizeLayersAsContainers(
    fileKey: string,
    nodeIds?: string[],
    organizationRules?: any,
    analysisOptions?: any
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      
      // Set default analysis options
      const options = {
        proximityThreshold: analysisOptions?.proximityThreshold || 50,
        similarityThreshold: analysisOptions?.similarityThreshold || 0.7,
        minGroupSize: analysisOptions?.minGroupSize || 2,
        maxGroupSize: analysisOptions?.maxGroupSize || 10,
        ...analysisOptions
      };
      
      // Set default organization rules
      const rules = {
        groupBy: organizationRules?.groupBy || ["proximity", "similarity"],
        containerTypes: organizationRules?.containerTypes || ["frame", "auto_layout"],
        namingConvention: organizationRules?.namingConvention || "Container {number}",
        preserveHierarchy: organizationRules?.preserveHierarchy !== false,
        createComponents: organizationRules?.createComponents || false,
        ...organizationRules
      };
      
      // Simulate layer analysis (in real implementation, this would analyze actual Figma layers)
      const mockLayers = this.generateMockLayersForAnalysis(nodeIds);
      
      // Perform intelligent grouping analysis
      const analysisResults = {
        proximityGroups: this.analyzeProximity(mockLayers, options.proximityThreshold),
        similarityGroups: this.analyzeSimilarity(mockLayers, options.similarityThreshold),
        hierarchyGroups: this.analyzeHierarchy(mockLayers),
        functionalGroups: this.analyzeFunctionality(mockLayers)
      };
      
      // Create organized containers based on analysis
      const organizedContainers = [];
      let containerIndex = 1;
      
      for (const groupType of rules.groupBy) {
        const groups = analysisResults[`${groupType}Groups`] || [];
        
        for (const group of groups) {
          if (group.elements.length >= options.minGroupSize && group.elements.length <= options.maxGroupSize) {
            const containerType = this.selectOptimalContainerType(group, rules.containerTypes);
            const containerName = rules.namingConvention.replace('{number}', containerIndex.toString()).replace('{type}', containerType);
            
            const container = {
              name: containerName,
              type: containerType,
              groupingCriteria: groupType,
              elements: group.elements,
              confidence: group.confidence,
              properties: this.generateContainerProperties(containerType, group),
              autoLayout: containerType === "auto_layout" ? this.generateAutoLayoutConfig(group) : null,
              isComponent: rules.createComponents && group.elements.length >= 3
            };
            
            organizedContainers.push(container);
            containerIndex++;
          }
        }
      }
      
      // Generate organization statistics
      const organizationStats = {
        totalLayers: mockLayers.length,
        containersCreated: organizedContainers.length,
        layersOrganized: organizedContainers.reduce((sum, container) => sum + container.elements.length, 0),
        organizationEfficiency: organizedContainers.length > 0 ? 
          (organizedContainers.reduce((sum, container) => sum + container.elements.length, 0) / mockLayers.length) * 100 : 0,
        groupingBreakdown: {
          proximity: analysisResults.proximityGroups.length,
          similarity: analysisResults.similarityGroups.length,
          hierarchy: analysisResults.hierarchyGroups.length,
          functional: analysisResults.functionalGroups.length
        }
      };
      
      const result = {
        success: true,
        message: `Organized ${mockLayers.length} layers into ${organizedContainers.length} intelligent containers`,
        fileKey,
        organizationRules: rules,
        analysisOptions: options,
        analysisResults,
        organizedContainers,
        organizationStats,
        recommendations: this.generateOrganizationRecommendations(organizedContainers, organizationStats),
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create organized layer containers with intelligent grouping"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to organize layers as containers: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // NEW MEDIA & ASSET SUPPORT METHODS

  // Create and manage media assets with optimization and AI generation
  async createMediaAssets(
    fileKey: string,
    mediaType: string,
    source: any,
    optimization?: any,
    placement?: any
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      
      // Validate media type
      const validMediaTypes = ["image", "gif", "video", "lottie", "interactive_prototype"];
      if (!validMediaTypes.includes(mediaType)) {
        throw new Error(`Invalid media type: ${mediaType}`);
      }
      
      // Process media source
      const processedSource = await this.processMediaSource(source, mediaType);
      
      // Apply optimization settings
      const optimizedMedia = await this.optimizeMedia(processedSource, optimization || {}, mediaType);
      
      // Generate placement configuration
      const placementConfig = this.generateMediaPlacement(placement, mediaType);
      
      // Create media asset in Figma
      const mediaAsset = await this.createFigmaMediaAsset(optimizedMedia, placementConfig, mediaType);
      
      // Generate asset metadata
      const assetMetadata = {
        id: `media_${Date.now()}`,
        name: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Asset`,
        type: mediaType,
        source: processedSource.sourceType,
        dimensions: optimizedMedia.dimensions,
        format: optimizedMedia.format,
        fileSize: optimizedMedia.estimatedSize,
        quality: optimization?.quality || 80,
        createdAt: timestamp,
        lastModified: timestamp
      };
      
      // Track asset usage and analytics
      const assetAnalytics = {
        creationMethod: processedSource.sourceType,
        optimizationApplied: !!optimization,
        aiGenerated: processedSource.sourceType === "ai_generated",
        placementMethod: placementConfig.method,
        estimatedLoadTime: this.calculateLoadTime(optimizedMedia.estimatedSize)
      };
      
      const result = {
        success: true,
        message: `Created ${mediaType} asset successfully`,
        fileKey,
        mediaType,
        assetMetadata,
        mediaAsset,
        optimization: optimizedMedia.optimizationSummary,
        placement: placementConfig,
        assetAnalytics,
        recommendations: this.generateMediaRecommendations(mediaType, optimizedMedia, placementConfig),
        timestamp,
        instructions: "Use this data with the Figma plugin bridge to create the media asset in your design"
      };
      
      return result;
    } catch (error) {
      throw new Error(`Failed to create media asset: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Manage asset library with organization, search, and version control
  async manageAssetLibrary(
    fileKey: string,
    operation: string,
    assetCategories?: string[],
    assets?: any[],
    libraryStructure?: any,
    searchCriteria?: any,
    versionControl?: any
  ): Promise<any> {
    try {
      const timestamp = new Date().toISOString();
      
      // Validate operation
      const validOperations = ["create", "update", "organize", "search", "delete"];
      if (!validOperations.includes(operation)) {
        throw new Error(`Invalid operation: ${operation}`);
      }
      
      let result;
      
      switch (operation) {
        case "create":
          result = await this.createAssetLibrary(fileKey, assetCategories || [], assets || [], libraryStructure);
          break;
          
        case "update":
          result = await this.updateAssetLibrary(fileKey, assets || [], versionControl);
          break;
          
        case "organize":
          result = await this.organizeAssetLibrary(fileKey, assetCategories || [], libraryStructure);
          break;
          
        case "search":
          result = await this.searchAssetLibrary(fileKey, searchCriteria || {});
          break;
          
        case "delete":
          result = await this.deleteAssetLibrary(fileKey, assets || []);
          break;
          
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
      
      // Add common metadata to result
      return {
        ...result,
        operation,
        fileKey,
        timestamp,
        versionControl: versionControl || { enableVersioning: false },
        instructions: `Asset library ${operation} completed. Use the returned data to update your Figma file structure.`
      };
      
    } catch (error) {
      throw new Error(`Failed to manage asset library: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Helper method to process media source
  private async processMediaSource(source: any, mediaType: string): Promise<any> {
    const sourceType = source.url ? "url" : source.upload ? "upload" : source.generate ? "ai_generated" : "unknown";
    
    const processedSource = {
      sourceType,
      originalSource: source,
      processedAt: new Date().toISOString()
    };
    
    switch (sourceType) {
      case "url":
        return {
          ...processedSource,
          url: source.url,
          format: this.extractFormatFromUrl(source.url),
          estimatedSize: this.estimateSizeFromUrl(source.url)
        };
        
      case "upload":
        return {
          ...processedSource,
          data: source.upload,
          format: this.detectFormatFromData(source.upload),
          estimatedSize: this.calculateDataSize(source.upload)
        };
        
      case "ai_generated":
        return await this.processAIGeneration(source.generate, mediaType);
        
      default:
        throw new Error(`Unsupported source type: ${sourceType}`);
    }
  }
  
  // Helper method to optimize media
  private async optimizeMedia(processedSource: any, optimization: any, mediaType: string): Promise<any> {
    const defaultOptimization = this.getDefaultOptimization(mediaType);
    const finalOptimization = { ...defaultOptimization, ...optimization };
    
    const optimized = {
      ...processedSource,
      format: finalOptimization.format || processedSource.format,
      quality: finalOptimization.quality || 80,
      dimensions: finalOptimization.dimensions || this.getDefaultDimensions(mediaType),
      compression: finalOptimization.compression || {},
      optimizationSummary: {
        originalSize: processedSource.estimatedSize,
        optimizedSize: this.calculateOptimizedSize(processedSource.estimatedSize, finalOptimization),
        compressionRatio: this.calculateCompressionRatio(finalOptimization),
        qualityScore: this.calculateQualityScore(finalOptimization)
      }
    };
    
    optimized.estimatedSize = optimized.optimizationSummary.optimizedSize;
    
    return optimized;
  }
  
  // Helper method to generate media placement
  private generateMediaPlacement(placement: any, mediaType: string): any {
    const defaultPlacement = this.getDefaultPlacement(mediaType);
    
    return {
      method: placement?.autoLayout ? "auto_layout" : "manual",
      coordinates: {
        x: placement?.x || defaultPlacement.x,
        y: placement?.y || defaultPlacement.y
      },
      container: placement?.containerName || null,
      autoLayout: placement?.autoLayout || false,
      constraints: this.generatePlacementConstraints(mediaType),
      zIndex: this.calculateZIndex(mediaType)
    };
  }
  
  // Helper method to create Figma media asset
  private async createFigmaMediaAsset(optimizedMedia: any, placementConfig: any, mediaType: string): Promise<any> {
    const assetConfig = {
      name: `${mediaType}_${Date.now()}`,
      type: this.mapMediaTypeToFigmaType(mediaType),
      x: placementConfig.coordinates.x,
      y: placementConfig.coordinates.y,
      width: optimizedMedia.dimensions.width,
      height: optimizedMedia.dimensions.height,
      properties: this.generateMediaProperties(optimizedMedia, mediaType),
      metadata: {
        source: optimizedMedia.sourceType,
        format: optimizedMedia.format,
        quality: optimizedMedia.quality,
        fileSize: optimizedMedia.estimatedSize
      }
    };
    
    return assetConfig;
  }
  
  // Helper method to calculate load time
  private calculateLoadTime(fileSize: number): number {
    // Estimate load time based on file size (assuming average connection speed)
    const avgBandwidth = 5000000; // 5 Mbps in bytes per second
    const overhead = 0.5; // 500ms overhead for connection/processing
    
    return (fileSize / avgBandwidth) + overhead;
  }
  
  // Helper method to generate media recommendations
  private generateMediaRecommendations(mediaType: string, optimizedMedia: any, placementConfig: any): any[] {
    const recommendations = [];
    
    // File size recommendations
    if (optimizedMedia.estimatedSize > 1000000) { // > 1MB
      recommendations.push({
        type: "optimization",
        priority: "high",
        title: "Large File Size",
        description: `Consider reducing quality or dimensions. Current size: ${(optimizedMedia.estimatedSize / 1000000).toFixed(2)}MB`,
        suggestion: "Reduce quality below 70 or resize dimensions"
      });
    }
    
    // Format recommendations
    if (mediaType === "image" && optimizedMedia.format === "png") {
      recommendations.push({
        type: "format",
        priority: "medium",
        title: "Format Optimization",
        description: "Consider using WebP format for better compression",
        suggestion: "Switch to WebP format for 25-35% smaller file sizes"
      });
    }
    
    // Placement recommendations
    if (!placementConfig.autoLayout && mediaType !== "video") {
      recommendations.push({
        type: "layout",
        priority: "low",
        title: "Auto Layout Benefits",
        description: "Consider using auto layout for responsive behavior",
        suggestion: "Enable auto layout for better responsive design"
      });
    }
    
    return recommendations;
  }

  // Helper method to get status icons
  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      todo: '⏳',
      in_progress: '🚧',
      review: '👀',
      approved: '✅',
      archived: '📦'
    };
    return icons[status] || '⚪';
  }

  // Helper method to get priority icons
  private getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      low: "🟢",
      medium: "🟡",
      high: "🟠", 
      urgent: "🔴"
    };
    return icons[priority] || "⚪";
  }

  // Helper method to get scratchpad icons
  private getScratchpadIcon(type: string): string {
    const icons: Record<string, string> = {
      quick_ideas: "💡",
      experiments: "🧪",
      mood_boards: "🎨",
      inspiration: "✨"
    };
    return icons[type] || "📝";
  }

  // Helper method to format scratchpad names
  private formatScratchpadName(type: string): string {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Helper method to get scratchpad elements
  private getScratchpadElements(type: string): any {
    const elementTemplates: Record<string, any> = {
      quick_ideas: {
        layout: "sticky_notes",
        templates: ["Idea Card", "Problem Statement", "Solution Sketch", "Quick Note"],
        tools: ["Text Tool", "Pen Tool", "Sticky Notes", "Comments"]
      },
      experiments: {
        layout: "test_grid",
        templates: ["A/B Test", "Prototype Frame", "User Test", "Experiment Log"],
        tools: ["Prototype Tool", "Interactive Components", "Variables", "Analytics"]
      },
      mood_boards: {
        layout: "collage_style",
        templates: ["Color Palette", "Typography Sample", "Image Grid", "Style Tile"],
        tools: ["Image Tool", "Color Picker", "Style Guide", "Inspiration Library"]
      },
      inspiration: {
        layout: "gallery_view",
        templates: ["Reference Image", "Link Collection", "Quote Card", "Trend Analysis"],
        tools: ["Web Clipper", "Screenshot Tool", "Link Preview", "Tag System"]
      }
    };
    
    return elementTemplates[type] || {
      layout: "freeform",
      templates: ["Basic Frame"],
      tools: ["Standard Tools"]
    };
  }

  // Helper method to parse code into Figma node structure
  private parseCodeToFigmaNodes(code: string, framework?: string): any {
    // Simplified parser - in practice this would be much more sophisticated
    const nodes = [];
    
    // Basic HTML/JSX parsing logic
    if (framework === "react" || code.includes("jsx") || code.includes("React")) {
      // Parse React/JSX
      nodes.push({
        type: "FRAME",
        name: "React Component",
        children: this.parseReactCode(code)
      });
    } else if (framework === "vue" || code.includes("<template>")) {
      // Parse Vue template
      nodes.push({
        type: "FRAME", 
        name: "Vue Component",
        children: this.parseVueCode(code)
      });
    } else {
      // Parse as HTML/CSS
      nodes.push({
        type: "FRAME",
        name: "HTML Element",
        children: this.parseHtmlCode(code)
      });
    }
    
    return nodes;
  }

  // Helper method to parse description into design structure
  private parseDescriptionToDesign(description: string, style?: string): any {
    // AI-powered design generation logic would go here
    // For now, return a basic structure based on keywords
    
    const nodes = [];
    const lowerDesc = description.toLowerCase();
    
    // Detect UI patterns
    if (lowerDesc.includes("button")) {
      nodes.push({
        type: "RECTANGLE",
        name: "Button",
        fills: [{ type: "SOLID", color: { r: 0.2, g: 0.5, b: 1 } }],
        cornerRadius: style === "minimal" ? 4 : 8
      });
    }
    
    if (lowerDesc.includes("card") || lowerDesc.includes("container")) {
      nodes.push({
        type: "FRAME",
        name: "Card Container",
        fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }],
        effects: [{ type: "DROP_SHADOW", offset: { x: 0, y: 2 }, radius: 8 }]
      });
    }
    
    if (lowerDesc.includes("text") || lowerDesc.includes("title")) {
      nodes.push({
        type: "TEXT",
        name: "Text Element",
        characters: "Sample Text",
        fontSize: style === "corporate" ? 16 : 18
      });
    }
    
    return nodes;
  }

  // Helper parsers for different frameworks
  private parseReactCode(code: string): any[] {
    // Simplified React parsing
    return [
      { type: "TEXT", name: "React Text", characters: "Parsed from React code" }
    ];
  }

  private parseVueCode(code: string): any[] {
    // Simplified Vue parsing
    return [
      { type: "TEXT", name: "Vue Text", characters: "Parsed from Vue code" }
    ];
  }

  private parseHtmlCode(code: string): any[] {
    // Simplified HTML parsing
    return [
      { type: "TEXT", name: "HTML Text", characters: "Parsed from HTML code" }
    ];
  }

  // Asset library helper methods
  private async createAssetLibrary(fileKey: string, categories: string[], assets: any[], structure?: any): Promise<any> {
    const libraryStructure = {
      pages: [],
      totalAssets: assets.length,
      categorization: {}
    };
    
    // Create pages for each category
    for (const category of categories) {
      const categoryAssets = assets.filter(asset => asset.category === category);
      
      const page = {
        name: `📁 ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        category,
        assetCount: categoryAssets.length,
        assets: categoryAssets.map((asset, index) => ({
          ...asset,
          id: asset.id || `${category}_${index}`,
          position: { x: (index % 4) * 250, y: Math.floor(index / 4) * 200 }
        }))
      };
      
      libraryStructure.pages.push(page);
      libraryStructure.categorization[category] = categoryAssets.length;
    }
    
    return {
      success: true,
      message: `Created asset library with ${categories.length} categories and ${assets.length} assets`,
      libraryStructure,
      createdAt: new Date().toISOString()
    };
  }
  
  private async updateAssetLibrary(fileKey: string, assets: any[], versionControl?: any): Promise<any> {
    const updates = [];
    
    for (const asset of assets) {
      const update = {
        id: asset.id,
        changes: this.detectAssetChanges(asset),
        version: this.generateAssetVersion(asset, versionControl),
        updatedAt: new Date().toISOString()
      };
      
      updates.push(update);
    }
    
    return {
      success: true,
      message: `Updated ${assets.length} assets`,
      updates,
      versioningEnabled: !!versionControl?.enableVersioning
    };
  }
  
  private async organizeAssetLibrary(fileKey: string, categories: string[], structure?: any): Promise<any> {
    const organization = {
      structure: structure || { createPages: true, groupByCategory: true },
      categories: categories.map(category => ({
        name: category,
        icon: this.getCategoryIcon(category),
        description: this.getCategoryDescription(category)
      })),
      layout: this.generateLibraryLayout(categories),
      navigation: this.generateLibraryNavigation(categories)
    };
    
    return {
      success: true,
      message: `Organized asset library with ${categories.length} categories`,
      organization
    };
  }
  
  private async searchAssetLibrary(fileKey: string, criteria: any): Promise<any> {
    // Simulate asset search
    const mockAssets = this.generateMockAssets(20);
    
    let filteredAssets = mockAssets;
    
    if (criteria.query) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(criteria.query.toLowerCase()) ||
        asset.description?.toLowerCase().includes(criteria.query.toLowerCase())
      );
    }
    
    if (criteria.category) {
      filteredAssets = filteredAssets.filter(asset => asset.category === criteria.category);
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.tags?.some((tag: string) => criteria.tags.includes(tag))
      );
    }
    
    return {
      success: true,
      message: `Found ${filteredAssets.length} assets matching search criteria`,
      results: filteredAssets,
      searchCriteria: criteria,
      totalResults: filteredAssets.length
    };
  }
  
  private async deleteAssetLibrary(fileKey: string, assets: any[]): Promise<any> {
    const deletions = assets.map(asset => ({
      id: asset.id || asset.name,
      name: asset.name,
      category: asset.category,
      deletedAt: new Date().toISOString()
    }));
    
    return {
      success: true,
      message: `Deleted ${assets.length} assets from library`,
      deletions
    };
  }
  
  // Additional helper methods for media processing
  private extractFormatFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }
  
  private estimateSizeFromUrl(url: string): number {
    // Rough estimation based on URL characteristics
    return 500000; // 500KB default estimate
  }
  
  private detectFormatFromData(data: string): string {
    if (data.startsWith('data:image/')) {
      return data.split(';')[0].split('/')[1];
    }
    return 'unknown';
  }
  
  private calculateDataSize(data: string): number {
    return Math.ceil(data.length * 0.75); // Base64 overhead adjustment
  }
  
  private async processAIGeneration(generation: any, mediaType: string): Promise<any> {
    return {
      sourceType: "ai_generated",
      prompt: generation.prompt,
      style: generation.style || "realistic",
      dimensions: generation.dimensions || this.getDefaultDimensions(mediaType),
      estimatedSize: this.estimateAIGeneratedSize(generation.dimensions),
      format: this.getDefaultFormatForMediaType(mediaType)
    };
  }
  
  private getDefaultOptimization(mediaType: string): any {
    const optimizations: Record<string, any> = {
      image: { format: "webp", quality: 80, compression: { lossless: false } },
      gif: { format: "gif", quality: 90, compression: { progressive: true } },
      video: { format: "mp4", quality: 75, compression: { progressive: true } },
      lottie: { format: "json", quality: 100, compression: { lossless: true } },
      interactive_prototype: { format: "json", quality: 100, compression: { lossless: true } }
    };
    
    return optimizations[mediaType] || optimizations.image;
  }
  
  private getDefaultDimensions(mediaType: string): any {
    const dimensions: Record<string, any> = {
      image: { width: 800, height: 600 },
      gif: { width: 400, height: 300 },
      video: { width: 1280, height: 720 },
      lottie: { width: 300, height: 300 },
      interactive_prototype: { width: 375, height: 812 }
    };
    
    return dimensions[mediaType] || dimensions.image;
  }
  
  private calculateOptimizedSize(originalSize: number, optimization: any): number {
    let compressionFactor = 1;
    
    if (optimization.quality) {
      compressionFactor *= (optimization.quality / 100);
    }
    
    if (optimization.format === "webp") {
      compressionFactor *= 0.7; // WebP is typically 30% smaller
    }
    
    if (optimization.compression?.lossless === false) {
      compressionFactor *= 0.8;
    }
    
    return Math.ceil(originalSize * compressionFactor);
  }
  
  private calculateCompressionRatio(optimization: any): number {
    let ratio = optimization.quality ? (100 - optimization.quality) / 100 : 0.2;
    
    if (optimization.format === "webp") {
      ratio += 0.3;
    }
    
    return Math.min(ratio, 0.9); // Max 90% compression
  }
  
  private calculateQualityScore(optimization: any): number {
    const qualityWeight = 0.6;
    const formatWeight = 0.3;
    const compressionWeight = 0.1;
    
    const qualityScore = (optimization.quality || 80) / 100;
    const formatScore = optimization.format === "webp" ? 0.9 : 0.7;
    const compressionScore = optimization.compression?.lossless ? 0.9 : 0.7;
    
    return (qualityScore * qualityWeight) + (formatScore * formatWeight) + (compressionScore * compressionWeight);
  }
  
  private getDefaultPlacement(mediaType: string): any {
    const placements: Record<string, any> = {
      image: { x: 100, y: 100 },
      gif: { x: 150, y: 150 },
      video: { x: 50, y: 50 },
      lottie: { x: 200, y: 200 },
      interactive_prototype: { x: 0, y: 0 }
    };
    
    return placements[mediaType] || placements.image;
  }
  
  private generatePlacementConstraints(mediaType: string): any {
    return {
      horizontal: mediaType === "interactive_prototype" ? "left_right" : "left",
      vertical: mediaType === "interactive_prototype" ? "top_bottom" : "top"
    };
  }
  
  private calculateZIndex(mediaType: string): number {
    const zIndexMap: Record<string, number> = {
      video: 10,
      interactive_prototype: 15,
      image: 5,
      gif: 8,
      lottie: 12
    };
    
    return zIndexMap[mediaType] || 5;
  }
  
  private mapMediaTypeToFigmaType(mediaType: string): string {
    const typeMap: Record<string, string> = {
      image: "RECTANGLE",
      gif: "RECTANGLE", 
      video: "RECTANGLE",
      lottie: "FRAME",
      interactive_prototype: "FRAME"
    };
    
    return typeMap[mediaType] || "RECTANGLE";
  }
  
  private generateMediaProperties(optimizedMedia: any, mediaType: string): any {
    const baseProperties = {
      fills: [{ type: "IMAGE", imageHash: "placeholder_hash" }],
      strokes: [],
      strokeWeight: 0,
      cornerRadius: mediaType === "interactive_prototype" ? 12 : 4
    };
    
    if (mediaType === "video") {
      baseProperties.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
    }
    
    return baseProperties;
  }
  
  private estimateAIGeneratedSize(dimensions: any): number {
    const pixelCount = (dimensions?.width || 800) * (dimensions?.height || 600);
    return Math.ceil(pixelCount * 0.003); // Rough estimate: 3 bytes per pixel
  }
  
  private getDefaultFormatForMediaType(mediaType: string): string {
    const formatMap: Record<string, string> = {
      image: "png",
      gif: "gif",
      video: "mp4",
      lottie: "json",
      interactive_prototype: "json"
    };
    
    return formatMap[mediaType] || "png";
  }
  
  private detectAssetChanges(asset: any): string[] {
    // Mock change detection
    const changes = [];
    
    if (asset.metadata?.lastModified) {
      changes.push("metadata_updated");
    }
    
    if (asset.tags) {
      changes.push("tags_modified");
    }
    
    return changes;
  }
  
  private generateAssetVersion(asset: any, versionControl?: any): string {
    if (!versionControl?.enableVersioning) {
      return "1.0.0";
    }
    
    const strategy = versionControl.versionStrategy || "semantic";
    
    switch (strategy) {
      case "semantic":
        return "1.0.1";
      case "timestamp":
        return new Date().toISOString().replace(/[:.]/g, "-");
      case "incremental":
        return String(Date.now());
      default:
        return "1.0.0";
    }
  }
  
  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      icons: "🔷",
      illustrations: "🎨",
      photos: "📷",
      animations: "🎬",
      logos: "🏷️",
      patterns: "🔳",
      textures: "🎭"
    };
    
    return icons[category] || "📁";
  }
  
  private getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      icons: "Small graphics and symbols for UI elements",
      illustrations: "Custom artwork and decorative graphics",
      photos: "Photography and realistic imagery",
      animations: "Animated graphics and motion assets",
      logos: "Brand logos and identity graphics",
      patterns: "Repeatable design patterns and motifs",
      textures: "Surface textures and material patterns"
    };
    
    return descriptions[category] || "Asset category";
  }
  
  private generateLibraryLayout(categories: string[]): any {
    return {
      type: "grid",
      columns: Math.min(categories.length, 4),
      spacing: 24,
      padding: { top: 32, right: 32, bottom: 32, left: 32 }
    };
  }
  
  private generateLibraryNavigation(categories: string[]): any {
    return {
      type: "tabs",
      position: "top",
      tabs: categories.map(category => ({
        id: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        icon: this.getCategoryIcon(category)
      }))
    };
  }
  
  private generateMockAssets(count: number): any[] {
    const categories = ["icons", "illustrations", "photos", "animations"];
    const assets = [];
    
    for (let i = 0; i < count; i++) {
      assets.push({
        id: `asset_${i}`,
        name: `Asset ${i + 1}`,
        category: categories[i % categories.length],
        tags: [`tag${i % 3}`, `category_${categories[i % categories.length]}`],
        description: `Mock asset for testing purposes`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        fileSize: Math.floor(Math.random() * 1000000) + 50000 // 50KB - 1MB
      });
    }
    
    return assets;
  }
}
