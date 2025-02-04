import mongoose from 'mongoose';

const projectCostingSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    numberOfDays: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    resources: [{
        resource: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resourse-Salary',
            required: true
        },
        numberOfDays: {
            type: Number,
            required: true
        },
        cost: {
            type: Number,
            required: true
        }
    }],
    expenses: {
        flightsCost: Number,
        totalFlights: Number,
        visaCost: Number,
        hotelNumberOfDays: Number,
        hotelCostPerDay: Number,
        dailyAllowance: Number,
        solutionName: String,
        solutionTotal: Number
    },
    costDetails: {
        taxRate: Number,
        discountRate: Number,
        marginRate: Number
    },
    calculations: {
        resourceCosts: Number,
        totalFlightsCost: Number,
        totalHotelCost: Number,
        travelExpensesTotal: Number,
        solutionTotal: Number,
        subtotal: Number,
        discountAmount: Number,
        taxAmount: Number,
        grandTotal: Number,
        marginAmount: Number,
        finalTotal: Number
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const ProjectCosting = mongoose.model('ProjectCosting', projectCostingSchema);

export default ProjectCosting;
