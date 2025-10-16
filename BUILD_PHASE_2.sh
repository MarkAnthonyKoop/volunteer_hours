#!/bin/bash
# Automated Phase 2 Builder for Volunteer Hours Tracker
# Builds all Phase 2 subprojects sequentially using atom

set -e  # Exit on any error

echo "═══════════════════════════════════════════════════════════"
echo "  Volunteer Hours Tracker - Phase 2 Automated Build"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "This script will build all Phase 2 components sequentially:"
echo "  1. api/            - RESTful API server"
echo "  2. database/       - PostgreSQL + Prisma"
echo "  3. authentication/ - JWT + OAuth"
echo "  4. integration/    - Full-stack integration"
echo ""
echo "Each component will be built autonomously by atom."
echo "This may take 10-20 minutes total."
echo ""
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

# Function to build a subproject
build_subproject() {
    local project_name=$1
    local project_desc=$2

    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  Building: $project_name"
    echo "  Description: $project_desc"
    echo "═══════════════════════════════════════════════════════════"
    echo ""

    if [ ! -d "$project_name" ]; then
        echo "❌ Error: Directory $project_name does not exist!"
        exit 1
    fi

    if [ ! -f "$project_name/USER_PROMPT.md" ]; then
        echo "❌ Error: $project_name/USER_PROMPT.md does not exist!"
        exit 1
    fi

    echo "📂 Entering directory: $project_name"
    cd "$project_name"

    echo "📄 USER_PROMPT.md found ($(wc -l < USER_PROMPT.md) lines)"
    echo ""
    echo "🤖 Launching atom to build $project_name..."
    echo "   (This will run in foreground until complete)"
    echo ""

    # Run atom in foreground (blocking)
    atom

    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo ""
        echo "✅ $project_name build completed successfully!"
    else
        echo ""
        echo "❌ $project_name build failed with exit code $exit_code"
        echo "   Please check the output above for errors."
        exit $exit_code
    fi

    # Return to parent directory
    cd ..

    echo ""
    echo "📊 Summary of $project_name:"
    if [ -f "$project_name/README.md" ]; then
        echo "   ✅ README.md created"
    fi
    if [ -f "$project_name/package.json" ]; then
        echo "   ✅ package.json created"
    fi
    if [ -d "$project_name/src" ]; then
        echo "   ✅ src/ directory created"
    fi
    if [ -d "$project_name/tests" ]; then
        echo "   ✅ tests/ directory created"
    fi

    echo ""
    echo "⏸️  Pausing for 5 seconds before next project..."
    sleep 5
}

# Build Phase 2.1: API
build_subproject "api" "RESTful API Server with Express + JWT"

# Build Phase 2.2: Database
build_subproject "database" "PostgreSQL + Prisma ORM"

# Build Phase 2.3: Authentication
build_subproject "authentication" "JWT + Google OAuth 2.0"

# Build Phase 2.4: Integration
build_subproject "integration" "Full-stack integration + Docker Compose"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "           🎉 PHASE 2 BUILD COMPLETE! 🎉"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "All Phase 2 components have been built successfully!"
echo ""
echo "📦 What was built:"
echo "   ✅ api/            - RESTful API server"
echo "   ✅ database/       - Database layer with Prisma"
echo "   ✅ authentication/ - Auth service"
echo "   ✅ integration/    - Full-stack integration"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Start the full stack:"
echo "   cd integration"
echo "   docker-compose up"
echo ""
echo "2. Access the application:"
echo "   Frontend: http://localhost:8080"
echo "   API:      http://localhost:3000"
echo "   API Docs: http://localhost:3000/api/docs"
echo ""
echo "3. Run tests:"
echo "   cd integration"
echo "   npm test"
echo ""
echo "4. Check each project's README.md for more details"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
