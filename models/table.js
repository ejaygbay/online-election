const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './electionDB.db'
});

/** USERS TABLE */
const USERS = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    visible: {
        type: DataTypes.STRING,
        defaultValue: 'true'
    }
}, {
    underscored: true
});

/** ELECTIONS TABLE */
const ELECTIONS = sequelize.define('election', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    election_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    visible: {
        type: DataTypes.STRING,
        defaultValue: 'true'
    }
}, {
    underscored: true
});

/** PARTIES TABLE */
const PARTY = sequelize.define('party', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    election_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    party_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    visible: {
        type: DataTypes.STRING,
        defaultValue: 'true'
    }
}, {
    underscored: true
});

/** POSITIONS TABLE */
const POSITIONS = sequelize.define('position', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    position_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    election_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    underscored: true
});

/** VOTERS TABLE*/
const VOTERS = sequelize.define('voter', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.BLOB,
        allowNull: false
    },
    election_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    voted: {
        type: DataTypes.STRING,
        defaultValue: 'false'
    },
    visible: {
        type: DataTypes.STRING,
        defaultValue: 'true'
    }
}, {
    underscored: true
});

/** CONTESTANTS TABLE */
const CONTESTANTS = sequelize.define('contestant', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middle_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    position_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    election_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    party_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    photo: {
        type: Sequelize.BLOB,
        allowNull: false
    },
    visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    underscored: true
});

/** ROLES TABLE */
const ROLES = sequelize.define('role', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visible: {
        type: DataTypes.STRING,
        defaultValue: 'true'
    }
}, {
    underscored: true
});


/**
 * ENTER DEFAULT VALUES IN DATABASE
 */
let roles = ['superadmin', 'admin', 'voter'];
let cnt = 0;

const insertDefaultRoles = (role) => {
    let msg;
    ROLES.findOrCreate({
            where: { role: role },
            defaults: role
        })
        .then(response => {
            if (!response[1]) {
                msg = "role aleready exists";
            } else {
                msg = "role created";
            }

            cnt += 1;
            if (cnt < roles.length) {
                insertDefaultRoles(roles[cnt]);
            } else {
                insertDefaultUser();
            }
        })
        .catch(error => {
            msg = error.message;
        })
}

const getRoleID = (role, callback) => {
    ROLES.findOne({
            where: { role: role },
            attributes: ['id', 'role']
        })
        .then(project => {
            return callback(project.dataValues);
        })
}

const insertDefaultUser = () => {
    getRoleID('superadmin', data => {
        let role_id = data.id;
        USERS
            .findOrCreate({
                where: {
                    email: "emmanuel@gmail.com"
                },
                defaults: {
                    first_name: "Emmanuel",
                    last_name: "Jaygbay",
                    email: "emmanuel@gmail.com",
                    password: "secret",
                    role_id: role_id
                }
            })
            .then(result => {
                insertDefaultParty(result[0].dataValues.id);
            })
    })
}

const insertDefaultParty = (userID) => {
    PARTY
        .findOrCreate({
            where: {
                party_name: "Independent"
            },
            defaults: {
                user_id: userID,
                election_id: "",
                party_name: "Independent"
            }
        })
        .then(result => {
            console.log("Default party created");
        })
        .catch(err => {
            console.log("Default party not created");
        })
}

// Reset DB
sequelize.sync({
        // alter: true,
        force: true
    }).then(suc => {
        console.log("SUCCESS=====", suc.models);
        insertDefaultRoles(roles[cnt]);
    })
    .catch(err => console.log("ERROR+++++", err))

module.exports = {
    USERS,
    ELECTIONS,
    PARTY,
    POSITIONS,
    VOTERS,
    CONTESTANTS,
    ROLES
};