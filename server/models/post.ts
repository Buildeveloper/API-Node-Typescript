export default function (sequelize, DataTypes) {
    const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNumm: false
        },
        text: {
            type: DataTypes.STRING,
            allowNumm: false
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNumm: false
        }
    });

    return Post;
}