class CreateFollows < ActiveRecord::Migration[5.2]
  def change
    create_table :follows do |t|
      t.integer :following, foreign_key: 'following_id'
      t.integer  :follower, foreign_key: 'follower_id'

      t.timestamps
    end
  end
end
