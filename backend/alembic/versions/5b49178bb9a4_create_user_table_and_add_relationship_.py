"""create User table and add relationship to Portfolio

Revision ID: 5b49178bb9a4
Revises: 85c0c45b2c92
Create Date: 2023-04-19 06:23:35.564604

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = '5b49178bb9a4'
down_revision = '85c0c45b2c92'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('alembic_version')
    op.drop_index('ix_tickers_ratio', table_name='tickers')
    # ### end Alembic commands ###


def downgrade() -> None:

    # Get the inspector for the current connection
    inspector = inspect(op.get_bind())

    # ### commands auto generated by Alembic - please adjust! ###
    if not any(index['name'] == 'ix_tickers_ratio' for index in inspector.get_indexes('tickers')):
        op.create_index('ix_tickers_ratio', 'tickers', ['ratio'], unique=False)

    op.create_table('alembic_version',
                    sa.Column('version_num', sa.VARCHAR(length=32),
                              autoincrement=False, nullable=False),
                    sa.PrimaryKeyConstraint(
                        'version_num', name='alembic_version_pkc')
                    )
    # ### end Alembic commands ###
