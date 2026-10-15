// Authoritative course data derived 1:1 from src/components/courses/Data_science.md

export interface CurriculumTopic {
  title: string;
  items: string[];
}

export interface CurriculumModule {
  id: string;
  moduleNumber: number;
  title: string;
  domain: string;
  practicalProject: string;
  projectOutcome: string;
  skillsDeveloped: string[];
  tools?: string[];
  submodules: CurriculumTopic[];
  notes?: string[];
}

export interface PracticalProject {
  id: string;
  number: number;
  title: string;
  domain: string;
  description: string;
  outcome: string;
  skills: string[];
  tools?: string[];
}

export interface TechStackCategory {
  category: string;
  description: string;
  technologies: string[];
}

export interface LearningStage {
  stage: number;
  title: string;
  domain: string;
  description: string;
}

export interface AdditionalLearningArea {
  title: string;
  topics: string[];
  note: string;
}

export interface CourseData {
  title: string;
  slug: string;
  badge: string;
  overview: string;
  progressionNote: string;
  syllabusNote: string;
  highlights: {
    duration: string;
    liveLearning: string;
    practicalExposure: string;
    learningApproach: string;
    coreFocus: string;
    careerPreparation: string;
  };
  modules: CurriculumModule[];
  additionalLearningAreas: AdditionalLearningArea[];
  techStack: TechStackCategory[];
  techStackNote: string;
  projects: PracticalProject[];
  careerPreparation: {
    components: string[];
    disclaimer: string;
  };
  certifications: {
    items: string[];
    disclaimer: string;
  };
  learningOutcomes: {
    items: string[];
    disclaimer: string;
  };
  learningProgression: LearningStage[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const dataScienceCourseData: CourseData = {
  title: "Data Science, AI & Business Intelligence Master Program",
  slug: "data-science-ai",
  badge: "Project-Based Professional Training",
  overview:
    "This is a project-based professional training program focused on Data Science, Data Analytics, Business Intelligence, Python programming, Machine Learning, and AI-assisted workflows. The program combines theoretical foundations with hands-on assignments and real-world business case studies to help learners understand how raw data can be transformed into meaningful insights and predictive solutions.",
  progressionNote:
    "The learning journey progresses from spreadsheet-based analytics and relational databases to Python, exploratory data analysis, visualization tools, machine learning, and AI-assisted business intelligence.",
  syllabusNote:
    "The seven modules organize the published project descriptions into a structured curriculum. They should not be interpreted as a verified verbatim copy of an official seven-module syllabus. A complete official syllabus is needed to establish the exact teaching order, hours per topic, assessments, algorithms, and the depth of advanced AI, deep learning, and NLP content.",
  highlights: {
    duration: "6 months",
    liveLearning: "280+ hours of live sessions",
    practicalExposure: "30+ projects and case studies advertised",
    learningApproach: "Approximately 80% practical learning, as advertised",
    coreFocus:
      "Data preparation, analysis, visualization, programming, predictive modeling, and AI-assisted productivity",
    careerPreparation:
      "Portfolio development, resume preparation, mock interviews, doubt-resolution support, and an advertised internship component",
  },
  modules: [
    {
      id: "module-1",
      moduleNumber: 1,
      title: "Spreadsheet Analytics with Microsoft Excel",
      domain: "Business Intelligence, Spreadsheet Analytics, Data Organization, and Reporting",
      practicalProject: "Retail Sales Analytics Dashboard",
      projectOutcome:
        "Build a retail sales analytics dashboard that summarizes revenue, product performance, category-level results, and regional trends.",
      tools: ["Microsoft Excel", "Airtable", "Git", "AI assistants"],
      skillsDeveloped: [
        "Excel",
        "Spreadsheet analytics",
        "Data cleaning",
        "Formulas",
        "PivotTables",
        "Dashboard creation",
        "Business reporting",
        "AI-assisted analysis",
      ],
      submodules: [
        {
          title: "1. Introduction to Data Analytics",
          items: [
            "Understanding data, information, and insights",
            "Role of data analytics in business decision-making",
            "Structured and tabular data",
            "Rows, columns, fields, records, and data types",
            "Understanding datasets and business requirements",
            "Identifying key performance indicators (KPIs)",
            "Translating business questions into analytical questions",
          ],
        },
        {
          title: "2. Data Importing and Organization",
          items: [
            "Importing datasets into Microsoft Excel",
            "Working with CSV and spreadsheet files",
            "Organizing worksheets and workbooks",
            "Formatting tables and column headers",
            "Identifying inconsistent data formats",
            "Handling duplicate records",
            "Identifying missing and invalid values",
            "Preparing structured datasets for analysis",
          ],
        },
        {
          title: "3. Excel Formulas and Functions",
          items: [
            "Arithmetic operations and cell references",
            "Relative, absolute, and mixed references",
            "SUM, AVERAGE, MIN, and MAX",
            "COUNT and COUNTA",
            "IF and nested logical conditions",
            "AND and OR functions",
            "Error handling and formula troubleshooting",
            "Lookup functions for retrieving information from tables",
            "Calculations involving sales, revenue, quantity, and performance",
          ],
        },
        {
          title: "4. Data Cleaning and Transformation",
          items: [
            "Standardizing data formats",
            "Sorting and filtering records",
            "Removing duplicates",
            "Identifying inconsistencies",
            "Conditional formatting",
            "Highlighting exceptional values",
            "Preparing data for aggregation and reporting",
          ],
        },
        {
          title: "5. PivotTables and Analytical Reporting",
          items: [
            "Creating PivotTables",
            "Grouping data by categories",
            "Aggregating numerical values",
            "Comparing products, categories, and regions",
            "Calculating sales totals and averages",
            "Summarizing business performance",
            "Using filters to explore different segments",
          ],
        },
        {
          title: "6. Data Visualization and Dashboard Development",
          items: [
            "Creating bar, column, line, and pie charts",
            "Selecting suitable charts for different data types",
            "Combining multiple visualizations",
            "Building an interactive analytical dashboard",
            "Highlighting business KPIs",
            "Presenting trends and comparisons",
            "Improving dashboard readability",
          ],
        },
        {
          title: "7. Airtable and Data Collaboration",
          items: [
            "Introduction to Airtable",
            "Organizing records in a collaborative workspace",
            "Understanding table-based data management",
            "Managing structured information",
            "Comparing spreadsheet-based workflows with database-style organization",
          ],
        },
        {
          title: "8. Version Control and AI-Assisted Productivity",
          items: [
            "Introduction to Git and version control",
            "Tracking changes to analytical files or project code",
            "Using AI assistants to understand formulas",
            "Generating and debugging formulas with AI",
            "Exploring data insights using AI assistance",
            "Improving productivity in reporting workflows",
          ],
        },
      ],
    },
    {
      id: "module-2",
      moduleNumber: 2,
      title: "SQL and Relational Database Analytics",
      domain: "Database Management, SQL Programming, Financial Analytics, and Structured Data Processing",
      practicalProject: "Digital Banking Database and Financial Analytics System",
      tools: ["SQL", "MySQL", "MySQL Workbench", "AI coding assistants"],
      projectOutcome:
        "Design a relational banking database and use SQL to retrieve customer information, analyze transactions, calculate financial summaries, and investigate unusual activity.",
      skillsDeveloped: [
        "Database design",
        "ER modeling",
        "SQL querying",
        "Joins",
        "Aggregations",
        "Window functions",
        "Financial reporting",
        "Database analysis",
      ],
      submodules: [
        {
          title: "1. Database Fundamentals",
          items: [
            "Introduction to databases and database management systems",
            "Relational database concepts",
            "Tables, rows, columns, and records",
            "Database schemas",
            "Primary keys and foreign keys",
            "Relationships between tables",
            "Entity-Relationship (ER) diagrams",
            "One-to-one, one-to-many, and many-to-many relationships",
            "Database normalization concepts",
          ],
        },
        {
          title: "2. Database Design and Table Management",
          items: [
            "Designing a relational database schema",
            "Creating tables",
            "Selecting appropriate data types",
            "Applying primary key constraints",
            "Applying foreign key constraints",
            "Understanding NOT NULL and UNIQUE constraints",
            "Inserting records into tables",
            "Updating and deleting records",
            "Maintaining relationships between banking entities",
          ],
        },
        {
          title: "3. SQL Query Fundamentals",
          items: [
            "SELECT statements",
            "WHERE conditions",
            "AND, OR, and NOT operators",
            "IN, BETWEEN, and LIKE",
            "ORDER BY",
            "DISTINCT",
            "LIMIT",
            "Filtering and sorting records",
            "Selecting specific columns",
            "Retrieving customer, account, and transaction information",
          ],
        },
        {
          title: "4. SQL Aggregation",
          items: [
            "COUNT, SUM, AVG, MIN, and MAX",
            "GROUP BY",
            "HAVING",
            "Aggregating transaction values",
            "Calculating account balances and transaction totals from suitable datasets",
            "Grouping financial information by customers, accounts, and transaction categories",
            "Generating summary reports",
          ],
        },
        {
          title: "5. SQL Joins",
          items: [
            "INNER JOIN",
            "LEFT JOIN",
            "RIGHT JOIN",
            "Understanding relationships between related tables",
            "Combining customer, account, and transaction data",
            "Identifying records across multiple database tables",
            "Avoiding incorrect aggregation caused by joins",
          ],
        },
        {
          title: "6. Advanced SQL",
          items: [
            "Subqueries",
            "Nested queries",
            "Common table expressions, where included in the teaching plan",
            "Window functions",
            "Ranking records",
            "Partitioning analytical results",
            "Calculating running totals and comparative metrics",
            "Building more complex financial queries",
          ],
        },
        {
          title: "7. Financial Analytics and Reporting",
          items: [
            "Transaction analysis",
            "Customer-level summaries",
            "Account activity analysis",
            "Aggregating transactions by time period",
            "Ranking customers or accounts",
            "Identifying unusual transaction patterns",
            "Preparing structured reports for business analysis",
          ],
        },
        {
          title: "8. AI-Assisted SQL Development",
          items: [
            "Using AI to generate SQL queries",
            "Understanding generated SQL",
            "Debugging syntax and logical errors",
            "Improving query readability",
            "Exploring query optimization suggestions",
            "Validating AI-generated results against the underlying data",
          ],
        },
      ],
    },
    {
      id: "module-3",
      moduleNumber: 3,
      title: "Power BI and Interactive Business Intelligence",
      domain: "Business Intelligence, Data Transformation, Data Modeling, and Interactive Visualization",
      practicalProject: "Global Population Analytics Dashboard",
      tools: ["Microsoft Power BI", "Power Query", "Data modeling & DAX"],
      projectOutcome:
        "Create an interactive dashboard that analyzes global population data, compares demographic patterns, and communicates regional trends.",
      skillsDeveloped: [
        "Data transformation",
        "Power Query",
        "Data modeling",
        "KPI development",
        "Interactive dashboards",
        "Data visualization",
        "Business reporting",
      ],
      submodules: [
        {
          title: "1. Introduction to Business Intelligence",
          items: [
            "Understanding business intelligence",
            "Role of dashboards in decision-making",
            "Understanding KPIs and performance metrics",
            "Turning datasets into actionable information",
            "Selecting appropriate charts for analytical questions",
            "Communicating findings to non-technical stakeholders",
          ],
        },
        {
          title: "2. Data Importing",
          items: [
            "Importing data into Power BI",
            "Working with spreadsheet and CSV datasets",
            "Understanding source tables",
            "Reviewing column names and data types",
            "Identifying data-quality issues",
          ],
        },
        {
          title: "3. Power Query and Data Preparation",
          items: [
            "Introduction to Power Query",
            "Cleaning imported data",
            "Removing unnecessary columns",
            "Filtering records",
            "Changing data types",
            "Handling missing or inconsistent values",
            "Splitting and merging columns",
            "Renaming fields",
            "Applying repeatable transformation steps",
          ],
        },
        {
          title: "4. Data Modeling",
          items: [
            "Creating relationships between tables",
            "Understanding primary and foreign key relationships",
            "Managing table relationships",
            "Understanding one-to-many relationships",
            "Organizing data for reporting",
            "Building a model that supports multiple analytical views",
          ],
        },
        {
          title: "5. Data Analysis and Visualization",
          items: [
            "Creating bar and column charts",
            "Creating line charts",
            "Using tables and matrix visuals",
            "Comparing regions and demographic categories",
            "Analyzing population trends",
            "Identifying growth patterns and differences",
            "Presenting geographical comparisons",
            "Using suitable visualizations for different KPIs",
          ],
        },
        {
          title: "6. Interactive Dashboard Development",
          items: [
            "Combining visualizations into dashboards",
            "Adding slicers and filters",
            "Creating interactive reports",
            "Enabling cross-filtering between visuals",
            "Designing dashboard layouts",
            "Highlighting important metrics",
            "Improving readability and navigation",
          ],
        },
        {
          title: "7. AI-Assisted Insights",
          items: [
            "Using supported AI visuals to explore data",
            "Generating summaries of analytical results",
            "Identifying patterns and trends",
            "Using AI-generated narratives as a starting point for interpretation",
            "Validating automatically generated insights against the actual data",
          ],
        },
      ],
    },
    {
      id: "module-4",
      moduleNumber: 4,
      title: "Tableau and Exploratory Visual Analytics",
      domain: "Data Visualization, Exploratory Analysis, Market Intelligence, and Hospitality Analytics",
      practicalProject: "Airbnb Market Insights Dashboard",
      tools: ["Tableau Desktop", "Tableau Public"],
      projectOutcome:
        "Develop an interactive dashboard that explores Airbnb listing prices, property types, availability, and location-based market patterns.",
      skillsDeveloped: [
        "Tableau",
        "Calculated fields",
        "Exploratory analysis",
        "Interactive dashboards",
        "Geographical visualization",
        "Market intelligence",
      ],
      submodules: [
        {
          title: "1. Introduction to Tableau",
          items: [
            "Understanding Tableau and its role in analytics",
            "Connecting datasets to Tableau",
            "Working with spreadsheet and CSV data",
            "Understanding dimensions and measures",
            "Organizing fields for analysis",
            "Creating initial visualizations",
          ],
        },
        {
          title: "2. Data Preparation",
          items: [
            "Examining Airbnb listing datasets",
            "Identifying relevant fields",
            "Understanding property categories and location attributes",
            "Cleaning inconsistent records",
            "Handling missing values where appropriate",
            "Filtering records for relevant analysis",
            "Preparing data for visualization",
          ],
        },
        {
          title: "3. Calculated Fields and Analytical Dimensions",
          items: [
            "Creating calculated fields",
            "Performing calculations on numerical attributes",
            "Comparing prices and availability",
            "Creating useful analytical measures",
            "Using dimensions to segment listings",
            "Grouping records into meaningful categories",
          ],
        },
        {
          title: "4. Exploratory Data Analysis",
          items: [
            "Analyzing listing prices",
            "Comparing property types",
            "Examining geographical patterns",
            "Investigating availability",
            "Exploring differences between locations",
            "Identifying high- and low-priced segments",
            "Examining relationships between listing attributes",
          ],
        },
        {
          title: "5. Visualization Techniques",
          items: [
            "Bar charts",
            "Line charts",
            "Scatter plots",
            "Geographic maps",
            "Distribution and comparison charts",
            "Selecting suitable visualizations for market questions",
            "Comparing multiple variables visually",
          ],
        },
        {
          title: "6. Interactive Dashboards",
          items: [
            "Combining multiple charts",
            "Adding filters and interactive controls",
            "Creating dashboard actions",
            "Exploring listings by location or property type",
            "Building interactive market reports",
            "Presenting findings through visual storytelling",
          ],
        },
        {
          title: "7. AI-Assisted Visualization",
          items: [
            "Using AI tools to understand datasets",
            "Obtaining suggestions for visual representations",
            "Exploring patterns and possible explanations",
            "Summarizing trends in market data",
            "Validating AI-generated interpretations",
          ],
        },
      ],
    },
    {
      id: "module-5",
      moduleNumber: 5,
      title: "Python Programming and Automation",
      domain: "Programming Fundamentals, Software Development, Data Extraction, and Application Logic",
      practicalProject: "Railway Reservation System",
      tools: [
        "Python",
        "Python IDE / Jupyter Notebook",
        "BeautifulSoup",
        "Regular expressions",
        "AI coding assistants",
      ],
      projectOutcome:
        "Build a Python-based railway reservation application that demonstrates programming logic, structured data handling, and application organization.",
      skillsDeveloped: [
        "Python programming",
        "Problem-solving",
        "Data structures",
        "Object-oriented programming",
        "File handling",
        "Exception handling",
        "Web scraping",
        "Automation fundamentals",
      ],
      submodules: [
        {
          title: "1. Python Fundamentals",
          items: [
            "Introduction to Python",
            "Installing and configuring a Python environment",
            "Running Python scripts",
            "Variables and constants",
            "Data types",
            "Type conversion",
            "Operators and expressions",
            "Input and output",
            "Writing readable Python code",
          ],
        },
        {
          title: "2. Conditional Statements and Loops",
          items: [
            "if, elif, and else",
            "Nested conditions",
            "for loops",
            "while loops",
            "break and continue",
            "Iterating through collections",
            "Implementing decision-making logic",
            "Repeating operations efficiently",
          ],
        },
        {
          title: "3. Python Data Structures",
          items: [
            "Lists",
            "Tuples",
            "Sets",
            "Dictionaries",
            "Indexing and slicing",
            "Adding, updating, and removing elements",
            "Iterating over collections",
            "Choosing appropriate data structures for different problems",
          ],
        },
        {
          title: "4. Functions and Modular Programming",
          items: [
            "Defining functions",
            "Parameters and return values",
            "Default arguments",
            "Scope of variables",
            "Reusable code",
            "Breaking large programs into smaller functions",
            "Organizing code into modules",
            "Improving maintainability",
          ],
        },
        {
          title: "5. Object-Oriented Programming",
          items: [
            "Classes and objects",
            "Attributes and methods",
            "Constructors",
            "Encapsulation",
            "Inheritance",
            "Polymorphism",
            "Organizing application entities using classes",
            "Applying object-oriented concepts to larger programs",
          ],
        },
        {
          title: "6. File Handling and Exception Management",
          items: [
            "Reading and writing files",
            "Working with structured text files",
            "Handling file paths",
            "Using try and except",
            "Understanding common runtime errors",
            "Validating user input",
            "Handling invalid operations",
            "Writing more reliable programs",
          ],
        },
        {
          title: "7. Web Scraping and Data Extraction",
          items: [
            "Understanding HTML structure",
            "Introduction to HTTP requests",
            "Extracting information from web pages",
            "Finding HTML elements",
            "Using BeautifulSoup",
            "Working with regular expressions where appropriate",
            "Cleaning extracted information",
            "Organizing scraped information into structured data",
            "Respecting website access rules and applicable restrictions",
          ],
        },
        {
          title: "8. AI-Assisted Programming",
          items: [
            "Using AI assistants to generate code",
            "Understanding code suggested by AI",
            "Debugging Python errors",
            "Improving code structure",
            "Obtaining explanations of programming concepts",
            "Testing generated solutions",
            "Identifying incorrect assumptions in AI-generated code",
          ],
        },
        {
          title: "9. Railway Reservation Application",
          items: [
            "Organizing train information",
            "Representing routes and schedules",
            "Managing passenger details",
            "Checking seat availability using application data",
            "Implementing booking-related logic",
            "Tracking reservation information",
            "Handling invalid inputs and errors",
            "Structuring application functionality with functions and classes",
          ],
        },
      ],
    },
    {
      id: "module-6",
      moduleNumber: 6,
      title: "Python for Data Analytics, Statistics, and Exploratory Data Analysis",
      domain: "Data Wrangling, Statistical Analysis, Exploratory Data Analysis, and Data Visualization",
      practicalProject: "Retail Sales Insights and Analytics Dashboard",
      tools: [
        "Python",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "Jupyter Notebook",
        "AI assistants",
      ],
      projectOutcome:
        "Create a Python-based analytical workflow that cleans retail data, calculates statistical measures, identifies patterns and outliers, and communicates sales insights through visualizations.",
      skillsDeveloped: [
        "Data manipulation",
        "Exploratory data analysis",
        "Descriptive statistics",
        "Outlier analysis",
        "Correlation",
        "Data visualization",
        "Analytical reporting",
      ],
      notes: [
        "The exact coverage of probability theory, inferential statistics, hypothesis testing, and statistical significance should be confirmed with the complete syllabus.",
      ],
      submodules: [
        {
          title: "1. Foundations of Data Analytics",
          items: [
            "Understanding analytical workflows",
            "Identifying business questions",
            "Examining datasets",
            "Understanding variables and data types",
            "Identifying numerical and categorical features",
            "Establishing a repeatable analysis process",
            "Preparing datasets for analytical investigation",
          ],
        },
        {
          title: "2. Python Libraries for Data Science",
          items: [
            "NumPy for numerical computation",
            "Pandas for tabular data manipulation",
            "Matplotlib for visualization",
            "Seaborn for statistical graphics",
            "Working with Python notebooks",
            "Importing and organizing libraries",
            "Using documentation to understand library functions",
          ],
        },
        {
          title: "3. Data Loading and Inspection",
          items: [
            "Loading CSV and spreadsheet datasets",
            "Inspecting rows and columns",
            "Understanding dataset dimensions",
            "Reviewing column names and data types",
            "Examining descriptive summaries",
            "Identifying missing or inconsistent records",
            "Understanding the structure of the data before analysis",
          ],
        },
        {
          title: "4. Data Cleaning and Preprocessing",
          items: [
            "Detecting missing values",
            "Handling duplicate records",
            "Correcting inconsistent data types",
            "Standardizing categorical values",
            "Filtering irrelevant observations",
            "Transforming columns",
            "Creating derived variables",
            "Preparing clean datasets for analysis",
          ],
        },
        {
          title: "5. Statistical Analysis",
          items: [
            "Mean, median, and mode",
            "Minimum and maximum values",
            "Range and measures of spread",
            "Variance and standard deviation",
            "Frequency distributions",
            "Percentiles and quartiles",
            "Understanding skewed distributions",
            "Comparing numerical summaries across categories",
          ],
        },
        {
          title: "6. Exploratory Data Analysis",
          items: [
            "Examining individual variables",
            "Understanding numerical distributions",
            "Analyzing categorical frequencies",
            "Identifying patterns and trends",
            "Comparing groups",
            "Examining relationships between variables",
            "Detecting unusual observations",
            "Formulating questions for further investigation",
          ],
        },
        {
          title: "7. Outlier and Correlation Analysis",
          items: [
            "Understanding outliers",
            "Detecting unusual values",
            "Using graphical and statistical approaches to identify anomalies",
            "Understanding correlation",
            "Creating correlation matrices",
            "Visualizing relationships between numerical variables",
            "Interpreting positive and negative relationships",
            "Distinguishing correlation from causation",
          ],
        },
        {
          title: "8. Data Visualization",
          items: [
            "Line charts",
            "Bar charts",
            "Histograms",
            "Box plots",
            "Scatter plots",
            "Heatmaps",
            "Category comparisons",
            "Trend visualization",
            "Selecting charts according to analytical objectives",
            "Improving chart labels and readability",
          ],
        },
        {
          title: "9. Retail Sales Analysis",
          items: [
            "Calculating revenue and sales metrics",
            "Comparing product categories",
            "Analyzing sales trends",
            "Examining sales distribution",
            "Identifying high-performing categories",
            "Comparing different business segments",
            "Using grouped summaries and pivot tables",
            "Presenting results through charts and reports",
          ],
        },
        {
          title: "10. AI-Assisted Data Analysis",
          items: [
            "Using AI to understand unfamiliar datasets",
            "Generating code for data cleaning",
            "Debugging Pandas operations",
            "Obtaining visualization suggestions",
            "Summarizing patterns found in the data",
            "Reviewing AI-generated interpretations",
            "Verifying numerical results before presenting conclusions",
          ],
        },
      ],
    },
    {
      id: "module-7",
      moduleNumber: 7,
      title: "Machine Learning and AI-Assisted Business Intelligence",
      domain:
        "Predictive Analytics, Supervised Learning, Unsupervised Learning, Model Evaluation, and Business Decision Support",
      practicalProject: "Integrated Machine Learning Business Intelligence Platform",
      tools: [
        "Python",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "Matplotlib",
        "Seaborn",
        "Jupyter Notebook",
        "AI assistants",
      ],
      projectOutcome:
        "Develop an integrated machine-learning workflow demonstrating regression, classification, clustering, model evaluation, and the presentation of business insights.",
      skillsDeveloped: [
        "Machine learning fundamentals",
        "Feature engineering",
        "Regression",
        "Classification",
        "Clustering",
        "Model evaluation",
        "Predictive analytics",
        "AI-assisted development",
      ],
      notes: [
        "The exact evaluation metrics and algorithms taught should be verified against the detailed teaching plan.",
      ],
      submodules: [
        {
          title: "1. Introduction to Machine Learning",
          items: [
            "Understanding artificial intelligence and machine learning",
            "Differences between data analytics and predictive modeling",
            "Understanding features and target variables",
            "Translating business problems into ML problems",
            "Supervised and unsupervised learning",
            "Training and testing datasets",
            "Understanding model generalization",
            "Developing a structured machine-learning workflow",
          ],
        },
        {
          title: "2. Data Preparation for Machine Learning",
          items: [
            "Loading and inspecting datasets",
            "Handling missing values",
            "Encoding categorical variables",
            "Scaling numerical features where appropriate",
            "Selecting relevant features",
            "Feature engineering",
            "Separating features and target variables",
            "Splitting datasets into training and testing subsets",
            "Avoiding data leakage",
          ],
        },
        {
          title: "3. Regression",
          items: [
            "Understanding regression problems",
            "Predicting continuous numerical values",
            "Introduction to linear regression",
            "Training a regression model",
            "Generating predictions",
            "Comparing predicted and actual values",
            "Evaluating regression performance",
            "Understanding regression errors",
            "Application: Predicting prices or other numerical business outcomes",
          ],
        },
        {
          title: "4. Classification",
          items: [
            "Understanding classification problems",
            "Predicting discrete categories",
            "Introduction to classification algorithms",
            "Training classification models",
            "Generating class predictions",
            "Understanding probability-based predictions",
            "Comparing classification results",
            "Evaluating classification performance",
            "Application: Customer churn prediction and identifying customers who may be at risk of leaving a service",
          ],
        },
        {
          title: "5. Clustering and Customer Segmentation",
          items: [
            "Understanding unsupervised learning",
            "Identifying patterns without predefined labels",
            "Grouping similar observations",
            "Introduction to clustering methods",
            "Preparing features for clustering",
            "Understanding distance and similarity",
            "Interpreting customer groups",
            "Translating clusters into possible business segments",
            "Application: Segmenting customers according to relevant behavioral or transactional attributes",
          ],
        },
        {
          title: "6. Model Evaluation",
          items: [
            "Training and testing model workflows",
            "Understanding prediction errors",
            "Evaluating regression models",
            "Evaluating classification models",
            "Confusion matrix",
            "Accuracy, precision, recall, and F1-score",
            "Understanding the strengths and limitations of different metrics",
            "Comparing models using appropriate criteria",
          ],
        },
        {
          title: "7. Model Improvement",
          items: [
            "Selecting appropriate algorithms",
            "Comparing model performance",
            "Identifying potential overfitting and underfitting",
            "Improving data preparation",
            "Reviewing feature selection",
            "Understanding hyperparameters",
            "Introduction to hyperparameter tuning",
            "Evaluating whether an improvement generalizes to unseen data",
          ],
        },
        {
          title: "8. Visualizing Machine-Learning Results",
          items: [
            "Plotting predicted versus actual values",
            "Visualizing classification results",
            "Comparing model performance",
            "Presenting customer segments",
            "Interpreting important features where supported by the model",
            "Communicating model limitations",
            "Turning predictions into understandable business insights",
          ],
        },
        {
          title: "9. AI-Assisted Machine Learning",
          items: [
            "Using AI assistants to understand ML concepts",
            "Generating starter code for model training",
            "Debugging model implementation",
            "Obtaining suggestions for feature engineering",
            "Exploring model-selection options",
            "Understanding hyperparameter tuning suggestions",
            "Reviewing model evaluation results",
            "Interpreting outputs with appropriate validation",
            "Documenting experiments and analytical decisions",
          ],
        },
        {
          title: "10. Business Intelligence Integration",
          items: [
            "Connecting analytical findings with business objectives",
            "Translating predictions into recommendations",
            "Identifying possible customer-retention opportunities",
            "Using price predictions to support analysis",
            "Interpreting customer segments",
            "Presenting results through visualizations and dashboards",
            "Communicating model limitations to stakeholders",
          ],
        },
      ],
    },
  ],
  additionalLearningAreas: [
    {
      title: "1. Deep Learning",
      topics: [
        "Introduction to deep learning",
        "Neural-network fundamentals",
        "Understanding TensorFlow and Keras",
        "Introduction to deep-learning workflows",
      ],
      note: "The exact architectures, exercises, and projects are not established by the publicly described seven project briefs.",
    },
    {
      title: "2. Natural Language Processing",
      topics: [
        "Introduction to text-processing concepts",
        "NLP-related tools, including NLTK",
        "Understanding structured and unstructured text",
      ],
      note: "The precise NLP algorithms and practical assignments require confirmation.",
    },
    {
      title: "3. Computer Vision",
      topics: [
        "Introduction to image-processing workflows",
        "OpenCV",
        "Tesseract for optical character recognition",
        "Extracting information from images",
      ],
      note: "The depth of computer-vision training and whether a complete project is included should be confirmed.",
    },
    {
      title: "4. Generative AI and AI Productivity",
      topics: [
        "Using AI assistants for coding and debugging",
        "Generating and improving analytical queries",
        "Supporting data preparation and visualization",
        "Exploring AI-assisted interpretation of analytical results",
        "Reviewing and validating AI-generated outputs",
      ],
      note: "The available project descriptions do not establish that students build production-ready LLM applications, retrieval-augmented generation systems, or autonomous AI agents.",
    },
    {
      title: "5. IBM Cloud and Related Technologies",
      topics: [
        "IBM-related tools and cloud technologies mentioned in course descriptions",
        "Exploration of enterprise cloud analytics workflows",
      ],
      note: "Exact cloud services, deployment exercises, certification assessments, and lab requirements should be confirmed before enrollment.",
    },
  ],
  techStack: [
    {
      category: "Programming and Data Processing",
      description: "Core programming and querying engines for data manipulation and transformation.",
      technologies: ["Python", "NumPy", "Pandas", "SQL", "MySQL"],
    },
    {
      category: "Spreadsheet and Business Intelligence",
      description: "Business intelligence tools for visual aggregation, relational modeling, and reporting.",
      technologies: ["Microsoft Excel", "Airtable", "Microsoft Power BI", "Tableau"],
    },
    {
      category: "Data Visualization",
      description: "Graphic libraries for statistical charting and exploratory visual communication.",
      technologies: ["Matplotlib", "Seaborn"],
    },
    {
      category: "Machine Learning and AI",
      description: "Algorithms and predictive modeling frameworks for supervised and unsupervised workflows.",
      technologies: ["Scikit-learn", "TensorFlow", "Keras", "NLTK"],
    },
    {
      category: "Data Extraction and Image Processing",
      description: "Libraries for unstructured data retrieval, web scraping, and computer vision tasks.",
      technologies: ["BeautifulSoup", "Regular expressions", "OpenCV", "Tesseract OCR"],
    },
    {
      category: "Development and Productivity",
      description: "Environments, version control, database management, and AI coding assistance.",
      technologies: [
        "Jupyter Notebook",
        "Python IDEs",
        "MySQL Workbench",
        "Git",
        "AI coding assistants",
      ],
    },
  ],
  techStackNote:
    "Not every technology is necessarily taught in equal depth or used in every project.",
  projects: [
    {
      id: "project-1",
      number: 1,
      title: "Retail Sales Analytics Dashboard",
      domain: "Business Intelligence & Spreadsheet Analytics",
      description:
        "Analyze retail sales using spreadsheet formulas, PivotTables, and dashboards.",
      outcome:
        "Summarizes revenue, product performance, category-level results, and regional trends into an interactive reporting view.",
      skills: ["Excel Formulas", "Data Cleaning", "PivotTables", "Dashboard Creation", "KPI Design"],
      tools: ["Microsoft Excel"],
    },
    {
      id: "project-2",
      number: 2,
      title: "Digital Banking Database and Financial Analytics System",
      domain: "Relational Database Analytics & SQL",
      description:
        "Design relational tables and analyze banking transactions with SQL.",
      outcome:
        "Retrieve customer information, analyze transactions, calculate financial balances, and investigate unusual transaction activity.",
      skills: ["Database Design", "ER Modeling", "Joins", "Aggregations", "Window Functions", "Financial Reporting"],
      tools: ["SQL", "MySQL", "MySQL Workbench"],
    },
    {
      id: "project-3",
      number: 3,
      title: "Global Population Analytics Dashboard",
      domain: "Interactive Business Intelligence",
      description:
        "Transform demographic datasets and build interactive Power BI reports.",
      outcome:
        "Analyzes global population data, compares demographic patterns, and communicates regional trends via cross-filtered visuals.",
      skills: ["Power Query", "Data Modeling", "DAX", "Demographic Analytics", "Interactive Dashboards"],
      tools: ["Microsoft Power BI", "Power Query"],
    },
    {
      id: "project-4",
      number: 4,
      title: "Airbnb Market Insights Dashboard",
      domain: "Exploratory Visual Analytics & Market Intelligence",
      description:
        "Investigate pricing, property categories, and location-based patterns with Tableau.",
      outcome:
        "Explores Airbnb listing prices, property types, availability, and location-based market patterns through visual storytelling.",
      skills: ["Tableau", "Calculated Fields", "Geographic Mapping", "Market Segmentation", "Exploratory Analytics"],
      tools: ["Tableau Desktop", "Tableau Public"],
    },
    {
      id: "project-5",
      number: 5,
      title: "Railway Reservation System",
      domain: "Python Programming & Application Logic",
      description:
        "Apply Python programming, data structures, functions, classes, and application logic.",
      outcome:
        "Demonstrates passenger booking logic, route scheduling, seat availability validation, and object-oriented modular design.",
      skills: ["Python OOP", "Data Structures", "Exception Handling", "File I/O", "Application Logic"],
      tools: ["Python", "Python IDE"],
    },
    {
      id: "project-6",
      number: 6,
      title: "Retail Sales Insights and Analytics Dashboard",
      domain: "Data Wrangling & Statistical Analysis",
      description:
        "Perform data cleaning, statistical analysis, exploratory analysis, and visualization using Python.",
      outcome:
        "Cleans retail data, calculates descriptive statistics, detects anomalies/outliers, analyzes correlations, and visualizes sales trends.",
      skills: ["Pandas Data Wrangling", "Descriptive Statistics", "Outlier Analysis", "Correlation", "Seaborn / Matplotlib"],
      tools: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter Notebook"],
    },
    {
      id: "project-7",
      number: 7,
      title: "Integrated Machine Learning Business Intelligence Platform",
      domain: "Predictive Analytics & Model Evaluation",
      description:
        "Demonstrate regression, classification, clustering, and model evaluation.",
      outcome:
        "Builds an end-to-end predictive workflow including price regression, customer churn classification, behavioral clustering, and business recommendations.",
      skills: ["Feature Engineering", "Regression", "Classification", "Clustering", "Model Evaluation (Confusion Matrix, F1)"],
      tools: ["Python", "Scikit-learn", "Pandas", "Jupyter Notebook"],
    },
  ],
  careerPreparation: {
    components: [
      "Resume preparation and improvement",
      "Portfolio development",
      "Mock interviews",
      "Practical assignments and case studies",
      "Doubt-resolution support",
      "An advertised internship component",
      "Exposure to business-oriented analytical problems",
      "Preparation for technical discussions around data analytics and machine learning",
    ],
    disclaimer:
      "The specific internship responsibilities, placement outcomes, employer partnerships, and career-support conditions should be verified directly with the provider.",
  },
  certifications: {
    items: [
      "A program completion or master certification",
      "An IBM-related certification",
      "An NSDC-related certification",
    ],
    disclaimer:
      "The exact credential names, issuing organizations, eligibility requirements, examination requirements, and additional fees should be confirmed before enrollment. Advertising a certification does not necessarily mean that it is automatically awarded upon course completion.",
  },
  learningOutcomes: {
    items: [
      "Organize and clean structured datasets.",
      "Use Excel for calculations, analysis, and reporting.",
      "Design relational databases and retrieve data using SQL.",
      "Transform data using Python and Pandas.",
      "Perform exploratory data analysis and descriptive statistics.",
      "Visualize analytical results using Power BI, Tableau, Matplotlib, and Seaborn.",
      "Develop structured Python applications using functions and object-oriented programming.",
      "Apply foundational regression, classification, and clustering workflows.",
      "Evaluate model performance using appropriate metrics.",
      "Use AI assistants to accelerate coding, analysis, and debugging while validating their outputs.",
      "Develop practical projects that demonstrate analytical reasoning and technical skills.",
      "Communicate findings through reports, dashboards, and portfolio projects.",
    ],
    disclaimer:
      "These are intended learning outcomes based on the published curriculum areas, not a guarantee of individual proficiency or employment.",
  },
  learningProgression: [
    {
      stage: 1,
      title: "Data Organization",
      domain: "Spreadsheet Analytics",
      description: "Excel formulas, PivotTables, data cleaning, and reporting dashboards.",
    },
    {
      stage: 2,
      title: "Structured Data Retrieval",
      domain: "Relational Databases",
      description: "SQL querying, joins, aggregation, schema design, and financial reports.",
    },
    {
      stage: 3,
      title: "Business Reporting",
      domain: "Power BI & BI Modeling",
      description: "Power Query ETL, relational modeling, and interactive executive dashboards.",
    },
    {
      stage: 4,
      title: "Visual Exploration",
      domain: "Tableau & Market Analytics",
      description: "Dimensions, measures, calculated fields, and geographical mapping.",
    },
    {
      stage: 5,
      title: "Programming Foundations",
      domain: "Python & Automation",
      description: "Data structures, OOP, file operations, web scraping, and application logic.",
    },
    {
      stage: 6,
      title: "Analytical Depth",
      domain: "Statistics & Exploratory Data Analysis",
      description: "Pandas wrangling, descriptive statistics, outlier detection, and correlation.",
    },
    {
      stage: 7,
      title: "Predictive Intelligence",
      domain: "Machine Learning & AI",
      description: "Regression, classification, clustering, evaluation, and AI-assisted BI.",
    },
  ],
  faqs: [
    {
      question: "What is the duration and format of the program?",
      answer:
        "The course has an advertised duration of 6 months, featuring 280+ hours of live learning sessions with approximately 80% practical learning approach.",
    },
    {
      question: "What practical projects are included in the curriculum?",
      answer:
        "The curriculum includes 7 core named projects: Retail Sales Analytics Dashboard (Excel), Digital Banking Database (SQL), Global Population Analytics Dashboard (Power BI), Airbnb Market Insights Dashboard (Tableau), Railway Reservation System (Python), Retail Sales Insights Dashboard (Python/Pandas), and an Integrated Machine Learning BI Platform (Scikit-learn). Over 30+ projects and case studies are advertised in the program.",
    },
    {
      question: "What tools and technologies are covered?",
      answer:
        "The technology stack covers Python, NumPy, Pandas, SQL, MySQL, Microsoft Excel, Airtable, Microsoft Power BI, Tableau, Matplotlib, Seaborn, Scikit-learn, TensorFlow, Keras, NLTK, BeautifulSoup, Regular expressions, OpenCV, Tesseract OCR, Jupyter Notebook, MySQL Workbench, Git, and AI coding assistants.",
    },
    {
      question: "Is there an internship component or career support included?",
      answer:
        "The program advertises portfolio development, resume preparation, mock interviews, doubt-resolution support, and an internship component. Specific internship responsibilities, placement conditions, and partner outcomes should be verified directly with the academic counsellors.",
    },
    {
      question: "What certifications are advertised for this course?",
      answer:
        "The program advertises a master/program completion certificate, an IBM-related certification, and an NSDC-related certification. Exact credential names, issuing organizations, eligibility requirements, and examination requirements should be confirmed before enrollment.",
    },
    {
      question: "How does the curriculum incorporate AI tools?",
      answer:
        "AI-assisted productivity is integrated across modules for formula troubleshooting, SQL query generation and debugging, code optimization, and analytical interpretation, alongside training in validating and reviewing AI outputs against real data.",
    },
  ],
};
