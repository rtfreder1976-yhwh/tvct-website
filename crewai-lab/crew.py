from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic
from crewai.project import CrewBase, agent, task, crew
import os

@CrewBase
class GrowthCrew:
    """Cleaning Business Domination Crew"""
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    def __init__(self):
        # Initialize Anthropic LLM - relying on env var ANTHROPIC_API_KEY
        self.llm = ChatAnthropic(
            model='claude-3-5-sonnet-20240620',
            verbose=True,
            temperature=0.7
        )

    @agent
    def growth_strategist(self) -> Agent:
        return Agent(
            config=self.agents_config['growth_strategist'],
            verbose=True,
            llm=self.llm
        )

    @agent
    def marketing_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['marketing_expert'],
            verbose=True,
            llm=self.llm
        )

    @agent
    def automation_architect(self) -> Agent:
        return Agent(
            config=self.agents_config['automation_architect'],
            verbose=True,
            llm=self.llm
        )

    @task
    def market_analysis_task(self) -> Task:
        return Task(config=self.tasks_config['market_analysis_task'])

    @task
    def marketing_plan_task(self) -> Task:
        return Task(config=self.tasks_config['marketing_plan_task'])

    @task
    def automation_blueprint_task(self) -> Task:
        return Task(config=self.tasks_config['automation_blueprint_task'])

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
